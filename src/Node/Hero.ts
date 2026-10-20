import Characters from "../Characters";
import Generic from "./Generic";
import { avatar, Outfit } from "../Avatar";

// Every skin is the player's avatar in a different outfit, built in code.
const builtCharacters: Record<string, () => ReturnType<typeof avatar>> = {};
const SKIN_OUTFITS: Record<string, Outfit> = {
  pyjama: "beach",
  toxic: "hazmat",
  business: "suit",
  licorne: "unicorn",
  emo: "emo",
  nerd: "nerd",
  rich: "rich",
  secret: "copine",
};
for (const [skin, outfit] of Object.entries(SKIN_OUTFITS)) {
  builtCharacters[skin] = () => avatar(outfit);
}

export default class Hero extends Generic {
  setup = async () => {
    const { characters } = this.globalModels;

    for (let id of Object.keys(Characters)) {
      if (id in Characters) {
        let character = Characters[id];
        if (character.id in builtCharacters) {
          this.models[character.id] = builtCharacters[character.id]();
          continue;
        }
        const { model, texture } = characters[character.id];
        await this._register(character.id, {
          model,
          texture,
          receiveShadow: true,
          castShadow: true,
        });
      }
    }
    return this.models;
  };

  getNode(key) {
    const node = super.getNode(key);

    return node;
  }
}
