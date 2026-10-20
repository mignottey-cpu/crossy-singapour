import Generic from './Generic';
import { promenade } from '../Singapore';
import { paperGround } from '../Exam';
import { hazeGround } from '../Haze';
import { byTheme } from '../Theme';

// The grass is now the granite (and timber) promenade of Marina Bay,
// exam paper in exam mode, or covered in ash in haze mode.
export default class Grass extends Generic {
  setup = async () => {
    const ground = byTheme({ singapore: promenade, exam: paperGround, haze: hazeGround });
    return this._registerBuilt([ground(0), ground(1), ground(2)]);
  };
}
