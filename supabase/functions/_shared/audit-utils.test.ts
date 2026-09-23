import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { hashIpWithSalt } from "./audit-utils.ts";

Deno.test("IP pseudonyms require a keyed salt and are deterministic", async () => {
  const ip = "203.0.113.42";
  const first = await hashIpWithSalt(ip, "a".repeat(32));
  const repeat = await hashIpWithSalt(ip, "a".repeat(32));
  const rotated = await hashIpWithSalt(ip, "b".repeat(32));

  assertEquals(first, repeat);
  assertEquals(first.length, 64);
  assertNotEquals(first, rotated);
});
