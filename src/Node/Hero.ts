import Characters from "../Characters";
import Generic from "./Generic";
import { avatar } from "../Avatar";

// Characters built in code instead of loaded from .obj files.
const builtCharacters = { moi: avatar };

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
