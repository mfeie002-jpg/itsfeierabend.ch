import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { clientIp, hashIpWithSalt } from "./audit-utils.ts";

Deno.test("IP pseudonyms require a keyed salt and are deterministic", async () => {
  const ip = "203.0.113.42";
  const first = await hashIpWithSalt(ip, "a".repeat(32));
  const repeat = await hashIpWithSalt(ip, "a".repeat(32));
  const rotated = await hashIpWithSalt(ip, "b".repeat(32));

  assertEquals(first, repeat);
  assertEquals(first.length, 64);
  assertNotEquals(first, rotated);
});


Deno.test("clientIp prefers gateway-attested headers over forwarded input", () => {
  const req = new Request("https://example.invalid", {
    headers: {
      "cf-connecting-ip": "203.0.113.10",
      "x-real-ip": "203.0.113.20",
      "x-forwarded-for": "198.51.100.99, 10.0.0.1",
    },
  });

  assertEquals(clientIp(req), "203.0.113.10");
});

Deno.test("clientIp uses x-real-ip before x-forwarded-for and ignores blanks", () => {
  const realIpReq = new Request("https://example.invalid", {
    headers: {
      "cf-connecting-ip": "   ",
      "x-real-ip": "203.0.113.20",
      "x-forwarded-for": "198.51.100.99, 10.0.0.1",
    },
  });
  assertEquals(clientIp(realIpReq), "203.0.113.20");

  const fallbackReq = new Request("https://example.invalid", {
    headers: {
      "x-forwarded-for": "198.51.100.99, 10.0.0.1",
    },
  });
  assertEquals(clientIp(fallbackReq), "198.51.100.99");
});
