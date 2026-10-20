import Generic from "./Generic";
import { boats } from "../Singapore";

// Logs are now Singapore River bumboats (keys 0-3 = 1 to 4 tiles long).
export default class Log extends Generic {
  setup = async () => this._registerBuilt(boats());
}
