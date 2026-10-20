import Generic from './Generic';
import { cyclingSigns } from '../Cycling';

// Railroad crossing lights are now cycling signs with flashing lamps.
export default class TrainLight extends Generic {
  setup = async () => {
    const { inactive, active_0, active_1 } = cyclingSigns();
    this.models = { '0': inactive, active_0, active_1 };
    return this.models;
  };
}
