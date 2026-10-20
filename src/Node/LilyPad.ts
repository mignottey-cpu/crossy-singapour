import Generic from "./Generic";
import { macbooks } from "../Singapore";
import { postIts } from "../Exam";
import { isExam } from "../Theme";

// Lily pads are now open MacBooks floating on the water (post-its in exam mode).
export default class LilyPad extends Generic {
  setup = async () => this._registerBuilt(isExam() ? postIts() : macbooks());
}
