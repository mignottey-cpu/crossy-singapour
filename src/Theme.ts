import AsyncStorage from "@react-native-async-storage/async-storage";

// The game has two looks that share the same gameplay:
// - "singapore": the Singapore city decor
// - "exam": everything turns into student work (ESSEC exam season)
// - "haze": Singapore under the haze, with masks and smog
export type Theme = "singapore" | "exam" | "haze";

const STORAGE_KEY = "@CrossySingapour:Theme";

let current: Theme = "singapore";
let restored = false;

export const getTheme = () => current;
export const isExam = () => current === "exam";
export const isHaze = () => current === "haze";

// Picks the value for the current theme.
export const byTheme = <T>(choices: Record<Theme, T>): T => choices[current];

// Restores the last chosen theme once, before the models are first loaded.
export async function restoreTheme(): Promise<Theme> {
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

export async function setTheme(theme: Theme) {
  current = theme;
  restored = true;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}
