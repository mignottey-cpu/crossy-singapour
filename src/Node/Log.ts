import Generic from "./Generic";
import { boats } from "../Singapore";
import { formulaStrips } from "../Exam";
import { maskBoxRows } from "../Haze";
import { byTheme } from "../Theme";

// Logs are now dragon boats, or strips of paper with
// a formula in exam mode, or boxes of N95 masks in haze mode
// (keys 0-3 = 1 to 4 tiles long).
export default class Log extends Generic {
  setup = async () => this._registerBuilt(
      byTheme({ singapore: boats, exam: formulaStrips, haze: maskBoxRows })()
    );
}
