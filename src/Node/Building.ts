import Generic from "./Generic";
import { buildings } from "../Singapore";

export default class Building extends Generic {
  setup = async () => this._registerBuilt(buildings());
}
