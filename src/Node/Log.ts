import Generic from "./Generic";
import { banknotes } from "../Singapore";

// Logs are now floating wads of Singapore dollars (keys 0-3 = 1 to 4 tiles long).
export default class Log extends Generic {
  setup = async () => this._registerBuilt(banknotes());
}
