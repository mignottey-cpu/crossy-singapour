import Generic from './Generic';
import { cyclePath } from '../Cycling';
import { examCorridor } from '../Exam';
import { mrtTrack } from '../Singapore';
import { neonTrack } from '../Love';
import { byTheme } from '../Theme';

// The railroad is now an MRT track (an exam hall corridor in exam mode, a
// Park Connector cycling path in haze mode).
export default class RailRoad extends Generic {
  setup = async () =>
    this._registerBuilt([
      byTheme({ singapore: mrtTrack, exam: examCorridor, haze: cyclePath, love: neonTrack })(),
    ]);
}
