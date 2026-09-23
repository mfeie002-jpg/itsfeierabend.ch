// Rate-limit + de-duplication helpers backed by the `rate_limits`
// and `audit_requests` tables. All defaults can be tuned via env vars.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const num = (name: string, fallback: number) => {
  const v = Deno.env.get(name);
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const LIMITS = {
  perIpDaily: num("AUDIT_LIMIT_PER_IP_DAILY", 5),
  globalDaily: num("AUDIT_LIMIT_GLOBAL_DAILY", 200),
  domainCooldownDays: num("AUDIT_DOMAIN_COOLDOWN_DAYS", 30),
};

const DAY_MS = 24 * 60 * 60 * 1000;

export interface LimitCheck {
  ok: boolean;
  reason?:
    | "per_ip_daily_exceeded"
    | "global_daily_exceeded";
}

export async function checkLimits(
  supabase: SupabaseClient,
  args: { ipHash: string | null },
): Promise<LimitCheck> {
  const since = new Date(Date.now() - DAY_MS).toISOString();

  // Global daily
  const { count: globalCount } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("scope", "global")
    .gte("created_at", since);
  if ((globalCount ?? 0) >= LIMITS.globalDaily) {
    return { ok: false, reason: "global_daily_exceeded" };
  }

  // Per-IP daily
  if (args.ipHash) {
    const { count: ipCount } = await supabase
      .from("rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("scope", "ip")
      .eq("ip_hash", args.ipHash)
      .gte("created_at", since);
    if ((ipCount ?? 0) >= LIMITS.perIpDaily) {
      return { ok: false, reason: "per_ip_daily_exceeded" };
    }
  }

  return { ok: true };
}

export async function recordLimitHits(
  supabase: SupabaseClient,
  ipHash: string | null,
) {
  const rows: { ip_hash: string; scope: string }[] = [
    { ip_hash: ipHash ?? "anonymous", scope: "global" },
  ];
  if (ipHash) rows.push({ ip_hash: ipHash, scope: "ip" });
  await supabase.from("rate_limits").insert(rows);
}
