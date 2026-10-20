import Generic from "./Generic";
import { buildings } from "../Singapore";
import { examBuildings } from "../Exam";
import { loveBuildings } from "../Love";
import { isExam, isLove } from "../Theme";

export default class Building extends Generic {
  setup = async () => this._registerBuilt(isLove() ? loveBuildings() : isExam() ? examBuildings() : buildings());
}
