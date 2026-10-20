import Generic from "./Generic";
import { macbooks } from "../Singapore";

// Lily pads are now open MacBooks floating on the water.
export default class LilyPad extends Generic {
  setup = async () => this._registerBuilt(macbooks());
}
