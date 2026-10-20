import Generic from "./Generic";
import { trees } from "../Singapore";
import { examTrees } from "../Exam";
import { isExam } from "../Theme";

export default class Tree extends Generic {
  setup = async () => this._registerBuilt(isExam() ? examTrees() : trees());
}
