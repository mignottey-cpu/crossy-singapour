import Generic from './Generic';
import { vehicles as singaporeVehicles } from '../Singapore';
import { voxelModel } from '../Voxel';
import { examVehicles } from '../Exam';
import { hazeVehicles } from '../Haze';
import { byTheme } from '../Theme';

const cars = [
  'police_car',
  'blue_car',
  'blue_truck',
  'green_car',
  'orange_car',
  'purple_car',
  'red_truck',
  'taxi',
  'grab_car',
];

export default class Car extends Generic {
  setup = async () => {
    const { vehicles } = this.globalModels;
    const builtVehicles = byTheme({
      singapore: singaporeVehicles,
      exam: examVehicles,
      haze: hazeVehicles,
    });

    for (let index in cars) {
      let car = cars[index];
      // Singapore vehicles (Grab, buses...) and exam objects are built in code
      if (car in builtVehicles) {
        this.models[`${index}`] = voxelModel(builtVehicles[car](), {
          castShadow: true,
          receiveShadow: true,
        });
        continue;
      }
      await this._register(`${index}`, {
        ...vehicles[car],
        castShadow: true,
        receiveShadow: true,
      });
    }

    return this.models;
  };
}
