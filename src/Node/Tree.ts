import Generic from "./Generic";
import { trees } from "../Singapore";

export default class Tree extends Generic {
  setup = async () => this._registerBuilt(trees());
}
