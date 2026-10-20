import Generic from './Generic';
import { cyclingSigns } from '../Cycling';
import { examClocks } from '../Exam';
import { mrtSigns } from '../Singapore';
import { heartSigns } from '../Love';
import { byTheme } from '../Theme';

// Railroad crossing lights are now MRT signs with flashing lamps (exam hall
// clocks in exam mode, cycling signs in haze mode).
export default class TrainLight extends Generic {
  setup = async () => {
    const { inactive, active_0, active_1 } = byTheme({
      singapore: mrtSigns,
      exam: examClocks,
      haze: cyclingSigns,
      love: heartSigns,
    })();
    this.models = { '0': inactive, active_0, active_1 };
    return this.models;
  };
}
