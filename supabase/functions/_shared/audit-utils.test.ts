import {
  clientIp,
  hashIpWithSalt,
  isIpLiteral,
  isPrivateIPv4,
  isPrivateIPv6,
  normalizeDomain,
  type UrlRejectReason,
} from "./audit-utils.ts";

function assert(
  condition: unknown,
  message = "Assertion failed",
): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEquals<T>(
  actual: T,
  expected: T,
  message = "Values differ",
): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(
      `${message}\nExpected: ${expectedJson}\nActual:   ${actualJson}`,
    );
  }
}

Deno.test("normalizeDomain adds HTTPS and canonicalizes host casing", () => {
  assertEquals(normalizeDomain(" Example.CH "), {
    url: "https://example.ch",
    domain: "example.ch",
  });
  assertEquals(normalizeDomain("www.Example.CH"), {
    url: "https://www.example.ch",
    domain: "example.ch",
  });
});

Deno.test("normalizeDomain preserves protocol, requested www host, and path", () => {
  assertEquals(
    normalizeDomain(
      "http://WWW.Example.CH/audit/start/?utm_source=test#result",
    ),
    {
      url: "http://www.example.ch/audit/start/",
      domain: "example.ch",
    },
  );
  assertEquals(normalizeDomain("https://example.ch/"), {
    url: "https://example.ch",
    domain: "example.ch",
  });
});

Deno.test("normalizeDomain rejects empty, malformed, and unsupported inputs", () => {
  const cases: Array<[unknown, UrlRejectReason]> = [
    [undefined, "empty"],
    [null, "empty"],
    [42, "empty"],
    ["   ", "empty"],
    ["https://", "malformed"],
    ["javascript:alert(1)", "unsupported_protocol"],
    ["data:text/plain,test", "unsupported_protocol"],
    ["file:///etc/passwd", "unsupported_protocol"],
    ["ftp://example.ch", "unsupported_protocol"],
    ["example", "invalid_host"],
  ];

  for (const [input, reason] of cases) {
    assertEquals(
      normalizeDomain(input),
      { error: reason },
      `Unexpected result for ${String(input)}`,
    );
  }
});

Deno.test("normalizeDomain blocks local metadata hosts and all IP literals", () => {
  const blockedHosts = [
    "localhost",
    "www.localhost",
    "localhost.localdomain",
    "metadata",
    "metadata.google.internal",
  ];
  for (const host of blockedHosts) {
    assertEquals(
      normalizeDomain(host),
      { error: "blocked_host" },
      `${host} must be blocked`,
    );
  }

  const ipLiterals = [
    "127.0.0.1",
    "10.0.0.1",
    "169.254.169.254",
    "8.8.8.8",
    "http://192.168.1.1/admin",
    "http://[::1]",
    "http://[2001:4860:4860::8888]",
  ];
  for (const host of ipLiterals) {
    assertEquals(
      normalizeDomain(host),
      { error: "ip_literal" },
      `${host} must be blocked`,
    );
  }
});

Deno.test("isIpLiteral distinguishes IPv4, IPv6, and domain names", () => {
  assertEquals(isIpLiteral("192.168.1.1"), "v4");
  assertEquals(isIpLiteral("2001:db8::1"), "v6");
  assertEquals(isIpLiteral("[::1]"), "v6");
  assertEquals(isIpLiteral("example.ch"), null);
  assertEquals(isIpLiteral("192.168.1"), null);
});

Deno.test("isPrivateIPv4 covers private, loopback, link-local, CGNAT, and reserved ranges", () => {
  const blocked = [
    "0.0.0.0",
    "10.0.0.1",
    "127.0.0.1",
    "169.254.169.254",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "100.64.0.1",
    "100.127.255.255",
    "198.18.0.1",
    "198.19.255.255",
    "224.0.0.1",
    "255.255.255.255",
  ];
  for (const ip of blocked) {
    assert(isPrivateIPv4(ip), `${ip} must be treated as non-public`);
  }

  const publicIps = [
    "1.1.1.1",
    "8.8.8.8",
    "100.63.255.255",
    "100.128.0.1",
    "172.15.255.255",
    "172.32.0.1",
    "198.17.255.255",
    "198.20.0.1",
    "223.255.255.255",
  ];
  for (const ip of publicIps) {
    assert(!isPrivateIPv4(ip), `${ip} must remain public`);
  }
});

Deno.test("isPrivateIPv6 covers loopback, unspecified, unique-local, link-local, and mapped IPv4", () => {
  const blocked = [
    "::",
    "::1",
    "0:0:0:0:0:0:0:1",
    "fc00::1",
    "fd12:3456::1",
    "fe80::1",
    "::ffff:10.0.0.1",
    "::ffff:127.0.0.1",
    "::ffff:192.168.1.1",
  ];
  for (const ip of blocked) {
    assert(isPrivateIPv6(ip), `${ip} must be treated as non-public`);
  }

  const publicIps = [
    "2001:4860:4860::8888",
    "2606:4700:4700::1111",
    "::ffff:8.8.8.8",
  ];
  for (const ip of publicIps) {
    assert(!isPrivateIPv6(ip), `${ip} must remain public`);
  }
});

Deno.test("IP pseudonyms are keyed, deterministic and change with the key", async () => {
  const ip = "203.0.113.42";
  const first = await hashIpWithSalt(ip, "a".repeat(32));
  const repeated = await hashIpWithSalt(ip, "a".repeat(32));
  const rotated = await hashIpWithSalt(ip, "b".repeat(32));
  assertEquals(first, repeated);
  assertEquals(first.length, 64);
  assert(first !== rotated, "Changing the HMAC salt must change the pseudonym");
});

Deno.test("clientIp prioritizes gateway-attested IP over an injected forwarded chain", () => {
  const req = new Request("https://example.invalid", {
    headers: {
      "cf-connecting-ip": "203.0.113.10",
      "x-real-ip": "203.0.113.20",
      "x-forwarded-for": "198.51.100.99, 10.0.0.1",
    },
  });
  assertEquals(clientIp(req), "203.0.113.10");
});

Deno.test("clientIp falls back from blank attested headers to x-real then forwarded", () => {
  const req = new Request("https://example.invalid", {
    headers: {
      "cf-connecting-ip": "   ",
      "x-real-ip": "203.0.113.20",
      "x-forwarded-for": "198.51.100.99, 10.0.0.1",
    },
  });
  assertEquals(clientIp(req), "203.0.113.20");
  const fallback = new Request("https://example.invalid", {
    headers: { "x-forwarded-for": "198.51.100.99, 10.0.0.1" },
  });
  assertEquals(clientIp(fallback), "198.51.100.99");
});
