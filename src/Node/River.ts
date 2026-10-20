import Generic from './Generic';
import { formulaRiver } from '../Exam';
import { isExam } from '../Theme';

export default class River extends Generic {
  setup = async () => {
    if (isExam()) {
      return this._registerBuilt([formulaRiver()]);
    }
    const {
      environment: { river },
    } = this.globalModels;
    await this._register(`0`, { ...river, castShadow: false, receiveShadow: true });
    return this.models;
  };
}
