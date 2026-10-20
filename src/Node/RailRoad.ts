import Generic from './Generic';
import { cyclePath } from '../Cycling';
import { examCorridor } from '../Exam';
import { isExam } from '../Theme';

// The railroad is now a Park Connector cycling path (an exam hall corridor
// in exam mode).
export default class RailRoad extends Generic {
  setup = async () => this._registerBuilt([isExam() ? examCorridor() : cyclePath()]);
}
