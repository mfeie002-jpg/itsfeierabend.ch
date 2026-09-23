// Shared helpers for the audit prototype.
// Handles URL/domain validation, SSRF-safe hostname resolution,
// bot verification (Cloudflare Turnstile), and rate-limit bookkeeping.

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ------------------------------------------------------------------
// URL / domain normalisation
// ------------------------------------------------------------------

const PRIVATE_V4 = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // CGNAT
  /^198\.(1[89])\./, // benchmarking
  /^224\./, /^225\./, /^226\./, /^227\./, /^228\./, /^229\./,
  /^23[0-9]\./, /^24[0-9]\./, /^25[0-5]\./, // multicast + reserved
];

const BLOCKED_HOSTS = new Set([
  "localhost", "localhost.localdomain", "ip6-localhost", "ip6-loopback",
  "broadcasthost", "metadata.google.internal", "metadata",
]);

export function isPrivateIPv4(ip: string): boolean {
  return PRIVATE_V4.some((rx) => rx.test(ip));
}

export function isPrivateIPv6(ip: string): boolean {
  const s = ip.toLowerCase();
  if (s === "::1" || s === "::" || s === "0:0:0:0:0:0:0:1") return true;
  if (s.startsWith("fc") || s.startsWith("fd")) return true; // unique local
  if (s.startsWith("fe80")) return true; // link local
  if (s.startsWith("::ffff:")) {
    // IPv4-mapped
    const v4 = s.slice(7);
    if (/^\d+\.\d+\.\d+\.\d+$/.test(v4)) return isPrivateIPv4(v4);
  }
  return false;
}

export function isIpLiteral(host: string): "v4" | "v6" | null {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return "v4";
  if (/^\[?[0-9a-f:]+\]?$/i.test(host) && host.includes(":")) return "v6";
  return null;
}

export type UrlRejectReason =
  | "empty" | "malformed" | "unsupported_protocol"
  | "blocked_host" | "ip_literal" | "invalid_host";

export function normalizeDomain(
  input: unknown,
): { url: string; domain: string } | { error: UrlRejectReason } {
  if (!input || typeof input !== "string") return { error: "empty" };
  let raw = input.trim();
  if (!raw) return { error: "empty" };
  // Reject if it looks like a URL to another scheme (javascript:, file:, ftp:, data:, ...)
  const schemeMatch = raw.match(/^([a-z][a-z0-9+.-]*):/i);
  if (schemeMatch && !/^https?$/i.test(schemeMatch[1])) {
    return { error: "unsupported_protocol" };
  }
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { error: "malformed" };
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { error: "unsupported_protocol" };
  }
  const host = u.hostname.replace(/^www\./, "").toLowerCase();
  if (!host) return { error: "invalid_host" };
  if (BLOCKED_HOSTS.has(host)) return { error: "blocked_host" };
  const ipKind = isIpLiteral(host);
  if (ipKind) return { error: "ip_literal" };
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) return { error: "invalid_host" };
  return {
    url: `${u.protocol}//${host}${u.pathname === "/" ? "" : u.pathname}`,
    domain: host,
  };
}

// ------------------------------------------------------------------
// SSRF: resolve hostname and confirm it points at a public IP.
// ------------------------------------------------------------------

export async function resolvePublicIps(host: string): Promise<
  { ok: true; ips: string[] } | { ok: false; reason: string }
> {
  const dns = (Deno as unknown as {
    resolveDns?: (
      hostname: string,
      recordType: "A" | "AAAA",
    ) => Promise<string[]>;
  }).resolveDns;
  if (typeof dns !== "function") {
    // Fallback: allow only if not an IP literal; the caller already blocked those.
    return { ok: true, ips: [] };
  }
  const ips: string[] = [];
  for (const rt of ["A", "AAAA"] as const) {
    try {
      const r = await dns(host, rt);
      if (Array.isArray(r)) ips.push(...r);
    } catch { /* nxdomain / no record */ }
  }
  if (ips.length === 0) return { ok: false, reason: "dns_unresolved" };
  for (const ip of ips) {
    if (ip.includes(":") ? isPrivateIPv6(ip) : isPrivateIPv4(ip)) {
      return { ok: false, reason: "private_ip" };
    }
  }
  return { ok: true, ips };
}

// ------------------------------------------------------------------
// Bot check (Cloudflare Turnstile)
// ------------------------------------------------------------------

export interface TurnstileVerdict {
  ok: boolean;
  reason?: string;
}

export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp: string | null,
): Promise<TurnstileVerdict> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return { ok: true, reason: "not_configured" }; // fail-open only when unset
  if (!token || typeof token !== "string") return { ok: false, reason: "missing_token" };
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = await r.json() as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return { ok: true };
    return { ok: false, reason: (data["error-codes"] ?? ["invalid"]).join(",") };
  } catch (e) {
    return { ok: false, reason: `verify_error:${(e as Error).message}` };
  }
}

// ------------------------------------------------------------------
// Misc
// ------------------------------------------------------------------

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email.trim()) && email.length < 255;
}

export async function hashIpWithSalt(
  ip: string,
  salt: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(salt),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`ip-hash-v1:${ip}`),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  const salt = Deno.env.get("IP_HASH_SALT");
  if (!salt || salt.length < 32) return null;
  return hashIpWithSalt(ip, salt);
}

export function clientIp(req: Request): string | null {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    null
  );
}
