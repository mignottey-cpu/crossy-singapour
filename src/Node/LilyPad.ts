import Generic from "./Generic";
import { macbooks } from "../Singapore";
import { postIts } from "../Exam";
import { floatingMasks } from "../Haze";
import { byTheme } from "../Theme";

// Lily pads are now open MacBooks floating on the water (post-its in exam mode, N95 masks in haze mode).
export default class LilyPad extends Generic {
  setup = async () => this._registerBuilt(
      byTheme({ singapore: macbooks, exam: postIts, haze: floatingMasks })()
    );
}
