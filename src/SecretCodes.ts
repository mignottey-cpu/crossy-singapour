import { Skin, SKINS } from "./Skins";
import { getWallet, isUnlocked, useCode } from "./Wallet";

// Secret codes typed on the home screen. Only hashes are kept here so the
// codes cannot be read in the game files; each one works once per device.

// cyrb53 string hash, salted (not cryptographic, just hides the words).
export function codeHash(text: string): string {
  const str = "crossy-sg:" + text;
  let h1 = 0xdeadbeef ^ 0x5eed;
  let h2 = 0x41c6ce57 ^ 0x5eed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

// Upper or lower case, accents and spaces around do not matter.
export const normalizeCode = (text: string) =>
  text.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export type CodeReward = { coins: number } | { randomSkin: true };

const CODES: Record<string, CodeReward> = {
  g3scm4kof1: { coins: 20 },
  ktuaiesz56: { coins: 100 },
  "1z89cvtiun": { coins: 10 },
  "1mxpkh2bt7t": { randomSkin: true },
  n4cr7b6dpx: { coins: 999 },
  "2a1fa0tyxav": { coins: -30 }, // a trap: takes coins away
};

export type CodeResult =
  | { ok: true; coins: number }
  | { ok: true; skin: Skin }
  | { ok: false; reason: "invalid" | "used" | "allSkins" };

export function redeemCode(text: string): CodeResult {
  const hash = codeHash(normalizeCode(text));
  const reward = CODES[hash];
  if (!reward) return { ok: false, reason: "invalid" };
  if (getWallet().usedCodes.includes(hash)) return { ok: false, reason: "used" };
  if ("coins" in reward) {
    useCode(hash, { coins: reward.coins });
    return { ok: true, coins: reward.coins };
  }
  // a random skin not owned yet, never the secret one
  const left = SKINS.filter((s) => s.id !== "secret" && !isUnlocked(s.id));
  // nothing left to give: the code is kept for a future skin
  if (!left.length) return { ok: false, reason: "allSkins" };
  const skin = left[Math.floor(Math.random() * left.length)];
  useCode(hash, { skin: skin.id });
  return { ok: true, skin };
}
