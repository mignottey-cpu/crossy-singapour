import Generic from "./Generic";
import { flagRafts } from "../Singapore";
import { postIts } from "../Exam";
import { floatingMasks } from "../Haze";
import { byTheme } from "../Theme";

// Lily pads are now rafts flying the Singapore flag (post-its in exam mode,
// N95 masks in haze mode).
export default class LilyPad extends Generic {
  setup = async () => this._registerBuilt(
      byTheme({ singapore: flagRafts, exam: postIts, haze: floatingMasks })()
    );
}
