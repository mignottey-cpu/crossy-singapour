import Generic from "./Generic";
import { obstacles } from "../Singapore";
import { examObstacles } from "../Exam";
import { isExam } from "../Theme";

export default class Boulder extends Generic {
  setup = async () => this._registerBuilt(isExam() ? examObstacles() : obstacles());
}
