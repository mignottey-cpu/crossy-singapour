import Generic from './Generic';
import { cyclePath } from '../Cycling';

// The railroad is now a Park Connector cycling path.
export default class RailRoad extends Generic {
  setup = async () => this._registerBuilt([cyclePath()]);
}
