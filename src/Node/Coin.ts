import Generic from "./Generic";
import { coin } from "../Coins";

// Coins to pick up, in the look of the current mode.
export default class Coin extends Generic {
  setup = async () => this._registerBuilt([coin()]);
}
