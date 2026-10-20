import Generic from './Generic';
import { formulaRiver } from '../Exam';
import { murkyRiver } from '../Haze';
import { violetRiver } from '../Love';
import { isExam, isHaze, isLove } from '../Theme';

export default class River extends Generic {
  setup = async () => {
    if (isLove()) {
      return this._registerBuilt([violetRiver()]);
    }
    if (isExam()) {
      return this._registerBuilt([formulaRiver()]);
    }
    if (isHaze()) {
      return this._registerBuilt([murkyRiver()]);
    }
    const {
      environment: { river },
    } = this.globalModels;
    await this._register(`0`, { ...river, castShadow: false, receiveShadow: true });
    return this.models;
  };
}
