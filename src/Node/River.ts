import Generic from './Generic';
import { formulaRiver } from '../Exam';
import { murkyRiver } from '../Haze';
import { isExam, isHaze } from '../Theme';

export default class River extends Generic {
  setup = async () => {
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
