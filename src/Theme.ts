import AsyncStorage from "@react-native-async-storage/async-storage";

// The game has two looks that share the same gameplay:
// - "singapore": the Singapore city decor
// - "exam": everything turns into student work (ESSEC exam season)
// - "haze": Singapore under the haze, with masks and smog
// - "love": love and music, shown automatically while the Copine skin is worn
//   (it is not a mode the player picks; the chosen mode comes back after)
export type Mode = "singapore" | "exam" | "haze";
export type Theme = Mode | "love";

const STORAGE_KEY = "@CrossySingapour:Theme";

let current: Mode = "singapore";
let love = false;
let restored = false;

export const getTheme = (): Theme => (love ? "love" : current);
export const isExam = () => getTheme() === "exam";
export const isHaze = () => getTheme() === "haze";
export const isLove = () => love;

// Turns the love decor on or off (follows the skin worn).
export const setLove = (on: boolean) => {
  love = on;
};

// Picks the value for the current theme.
export const byTheme = <T>(choices: Record<Theme, T>): T => choices[getTheme()];

// Restores the last chosen theme once, before the models are first loaded.
export async function restoreTheme(): Promise<Mode> {
  if (restored) return current;
  restored = true;
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === "exam" || saved === "singapore" || saved === "haze") current = saved;
  } catch {
    // storage can be unavailable (private mode, sandboxed page): keep default
  }
  return current;
}

export async function setTheme(theme: Mode) {
  current = theme;
  restored = true;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}
