import Generic from "./Generic";
import { obstacles } from "../Singapore";
import { examObstacles } from "../Exam";
import { hazeObstacles } from "../Haze";
import { loveObstacles } from "../Love";
import { byTheme } from "../Theme";

export default class Boulder extends Generic {
  setup = async () => this._registerBuilt(
      byTheme({ singapore: obstacles, exam: examObstacles, haze: hazeObstacles, love: loveObstacles })()
    );
}
