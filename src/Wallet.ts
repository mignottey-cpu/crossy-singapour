import AsyncStorage from "@react-native-async-storage/async-storage";

import { DEFAULT_SKIN, isSkinId, SKINS, SkinId } from "./Skins";

// Coins picked up in the games, skins bought with them and the skin worn.
// Saved on the device so they are kept from one visit to the next.

const STORAGE_KEY = "@CrossySingapour:Wallet";

type WalletState = { coins: number; unlocked: SkinId[]; selected: SkinId };

const FREE_SKINS = SKINS.filter((s) => s.price === 0).map((s) => s.id);

let state: WalletState = {
  coins: 0,
  unlocked: FREE_SKINS,
  selected: DEFAULT_SKIN,
};
let restored = false;
const listeners = new Set<(state: WalletState) => void>();

const save = () => {
  listeners.forEach((listener) => listener(state));
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
    // storage can be unavailable (private mode): keep playing without it
  });
};

export const getWallet = () => state;

export function subscribeWallet(listener: (state: WalletState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function restoreWallet(): Promise<WalletState> {
  if (restored) return state;
  restored = true;
  try {
    const saved = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? "null");
    if (saved) {
      const unlocked = [...FREE_SKINS];
      for (const id of saved.unlocked ?? []) {
        if (isSkinId(id) && !unlocked.includes(id)) unlocked.push(id);
      }
      state = {
        coins: Math.max(0, Math.floor(Number(saved.coins) || 0)),
        unlocked,
        selected:
          isSkinId(saved.selected) && unlocked.includes(saved.selected)
            ? saved.selected
            : DEFAULT_SKIN,
      };
    }
  } catch {}
  listeners.forEach((listener) => listener(state));
  return state;
}

export function addCoins(amount: number) {
  state = { ...state, coins: state.coins + amount };
  save();
}

export const isUnlocked = (id: SkinId) => state.unlocked.includes(id);

// Buys a skin if there are enough coins. Returns whether it worked.
export function buySkin(id: SkinId): boolean {
  const skin = SKINS.find((s) => s.id === id);
  if (!skin || isUnlocked(id) || state.coins < skin.price) return false;
  state = {
    ...state,
    coins: state.coins - skin.price,
    unlocked: [...state.unlocked, id],
  };
  save();
  return true;
}

export function selectSkin(id: SkinId) {
  if (!isUnlocked(id)) return;
  state = { ...state, selected: id };
  save();
}
