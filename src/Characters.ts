import { SKINS } from "./Skins";

// Characters the player can play with: the skins (see Skins.ts).
export default Object.fromEntries(
  SKINS.map(({ id, name }) => [id, { id, name }])
) as Record<string, { id: string; name: string }>;
