import { describe, expect, mock, test } from "bun:test";

const store = new Map<string, string>();
mock.module("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: async (k: string) => store.get(k) ?? null,
    setItem: async (k: string, v: string) => void store.set(k, v),
  },
}));

const { redeemCode } = await import("../src/SecretCodes");
const { getWallet } = await import("../src/Wallet");

describe("codes secrets", () => {
  test("pieces, majuscules et usage unique", () => {
    expect(redeemCode("Emiliano")).toEqual({ ok: true, coins: 20 });
    expect(redeemCode("EMILIANO")).toEqual({ ok: false, reason: "used" });
    expect(redeemCode(" yves ")).toEqual({ ok: true, coins: 100 });
    expect(redeemCode("SingaPour")).toEqual({ ok: true, coins: 10 });
    expect(redeemCode("Nora")).toEqual({ ok: true, coins: 999 });
    expect(redeemCode("nora")).toEqual({ ok: false, reason: "used" });
    expect(redeemCode("paris")).toEqual({ ok: false, reason: "invalid" });
    expect(getWallet().coins).toBe(1129);
  });

  test("irina donne un skin aleatoire, jamais le secret", () => {
    const before = getWallet().unlocked.length;
    const r = redeemCode("IRINA") as any;
    expect(r.ok).toBe(true);
    expect(r.skin.id).not.toBe("secret");
    expect(before).toBe(3);
    expect(getWallet().unlocked).toContain(r.skin.id);
    expect(getWallet().selected).toBe(r.skin.id);
    expect(redeemCode("irina")).toEqual({ ok: false, reason: "used" });
    expect(JSON.stringify(getWallet())).not.toContain("irina");
  });
});
