import Generic from "./Generic";
import { banknotes } from "../Singapore";
import { formulaStrips } from "../Exam";
import { isExam } from "../Theme";

// Logs are now floating wads of Singapore dollars, or strips of paper with
// a formula in exam mode (keys 0-3 = 1 to 4 tiles long).
export default class Log extends Generic {
  setup = async () => this._registerBuilt(isExam() ? formulaStrips() : banknotes());
}
