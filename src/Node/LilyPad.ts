import Generic from "./Generic";
import { lotus } from "../Singapore";

export default class LilyPad extends Generic {
  setup = async () => this._registerBuilt([lotus()]);
}
