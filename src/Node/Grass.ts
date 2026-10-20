import Generic from './Generic';
import { promenade } from '../Singapore';
import { paperGround } from '../Exam';
import { isExam } from '../Theme';

// The grass is now the granite (and timber) promenade of Marina Bay,
// or exam paper in exam mode.
export default class Grass extends Generic {
  setup = async () => {
    const ground = isExam() ? paperGround : promenade;
    return this._registerBuilt([ground(0), ground(1), ground(2)]);
  };
}
