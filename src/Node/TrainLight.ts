import Generic from './Generic';
import { cyclingSigns } from '../Cycling';
import { examClocks } from '../Exam';
import { isExam } from '../Theme';

// Railroad crossing lights are now cycling signs with flashing lamps
// (exam hall clocks in exam mode).
export default class TrainLight extends Generic {
  setup = async () => {
    const { inactive, active_0, active_1 } = isExam() ? examClocks() : cyclingSigns();
    this.models = { '0': inactive, active_0, active_1 };
    return this.models;
  };
}
