import Generic from './Generic';
import { vehicles as singaporeVehicles } from '../Singapore';
import { voxelModel } from '../Voxel';

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

    for (let index in cars) {
      let car = cars[index];
      // Singapore vehicles (Grab, buses) are built in code
      if (car in singaporeVehicles) {
        this.models[`${index}`] = voxelModel(singaporeVehicles[car](), {
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
