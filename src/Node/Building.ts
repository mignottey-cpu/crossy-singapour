import Generic from "./Generic";
import { buildings } from "../Singapore";
import { examBuildings } from "../Exam";
import { isExam } from "../Theme";

export default class Building extends Generic {
  setup = async () => this._registerBuilt(isExam() ? examBuildings() : buildings());
}
