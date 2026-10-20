import Generic from "./Generic";
import { trees } from "../Singapore";
import { examTrees } from "../Exam";
import { hazeTrees } from "../Haze";
import { loveTrees } from "../Love";
import { byTheme } from "../Theme";

export default class Tree extends Generic {
  setup = async () => this._registerBuilt(
      byTheme({ singapore: trees, exam: examTrees, haze: hazeTrees, love: loveTrees })()
    );
}
