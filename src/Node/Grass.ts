import Generic from './Generic';
import { promenade } from '../Singapore';

// The grass is now the granite (and timber) promenade of Marina Bay.
export default class Grass extends Generic {
  setup = async () => this._registerBuilt([promenade(0), promenade(1), promenade(2)]);
}
