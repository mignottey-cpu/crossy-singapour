import Generic from "./Generic";
import { lizards } from "../Singapore";

// Logs are now swimming water monitors (keys 0-3 = 1 to 4 tiles long).
export default class Log extends Generic {
  setup = async () => this._registerBuilt(lizards());
}
