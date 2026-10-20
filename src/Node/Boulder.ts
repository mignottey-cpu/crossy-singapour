import Generic from "./Generic";
import { obstacles } from "../Singapore";

export default class Boulder extends Generic {
  setup = async () => this._registerBuilt(obstacles());
}
