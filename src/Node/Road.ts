import Generic from './Generic';
import { blackboardRoad } from '../Exam';
import { isExam } from '../Theme';

/*
road_0: Multi Lane Road.
road_1: Single Lane Road.
*/
export default class Road extends Generic {
  setup = async () => {
    if (isExam()) {
      // a blackboard, the same for both lane kinds
      return this._registerBuilt([blackboardRoad(), blackboardRoad()]);
    }
    const {
      environment: { road },
    } = this.globalModels;

    for (let i = 0; i < 2; i++) {
      await this._register(`${i}`, {
        ...road[`${i}`],
        castShadow: false,
        receiveShadow: true,
      });
    }
    return this.models;
  };
}
