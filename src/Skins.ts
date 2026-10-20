// Skins the player can wear. The first three are unlocked from the start,
// the others are bought with the coins picked up during the games.
export type SkinId =
  | "pyjama"
  | "toxic"
  | "business"
  | "licorne"
  | "emo"
  | "nerd"
  | "rich"
  | "secret";

// `revealedName` replaces the name once the skin has been bought.
export type Skin = { id: SkinId; name: string; price: number; revealedName?: string };

export const SKINS: Skin[] = [
  { id: "pyjama", name: "Pyjama Boy", price: 0 },
  { id: "toxic", name: "Toxic Guy", price: 0 },
  { id: "business", name: "Business Boy", price: 0 },
  { id: "licorne", name: "Licorne Boy", price: 30 },
  { id: "emo", name: "Emo Boy", price: 50 },
  { id: "nerd", name: "Nerd Boy", price: 75 },
  { id: "rich", name: "Rich Boy", price: 150 },
  { id: "secret", name: "Secret", price: 999, revealedName: "Copine" },
];

export const DEFAULT_SKIN: SkinId = "pyjama";

export const isSkinId = (id: unknown): id is SkinId =>
  SKINS.some((skin) => skin.id === id);
