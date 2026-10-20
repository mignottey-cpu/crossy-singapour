import Hero from "./Node/Hero";
import Car from "./Node/Car";
import Log from "./Node/Log";
import Road from "./Node/Road";
import Grass from "./Node/Grass";
import River from "./Node/River";
import Tree from "./Node/Tree";
import Train from "./Node/Train";
import Boulder from "./Node/Boulder";
import Building from "./Node/Building";
import Coin from "./Node/Coin";
import RailRoad from "./Node/RailRoad";
import TrainLight from "./Node/TrainLight";
import LilyPad from "./Node/LilyPad";
import { restoreTheme } from "./Theme";

class ModelLoader {
  // Called at start-up, and again when the player switches between the
  // Singapore and exam modes.
  loadModels = async () => {
    await restoreTheme();
    this._lilyPad = new LilyPad();
    this._grass = new Grass();
    this._road = new Road();
    this._river = new River();
    this._boulder = new Boulder();
    this._tree = new Tree();
    this._building = new Building();
    this._coin = new Coin();
    this._car = new Car();
    this._railroad = new RailRoad();
    this._train = new Train();
    this._trainLight = new TrainLight();
    this._log = new Log();
    this._hero = new Hero();

    // try {
    await Promise.all([
      this._lilyPad.setup(),
      this._road.setup(),
      this._grass.setup(),
      this._river.setup(),
      this._log.setup(),
      this._boulder.setup(),
      this._tree.setup(),
      this._building.setup(),
      this._coin.setup(),
      this._car.setup(),
      this._railroad.setup(),
      this._train.setup(),
      this._hero.setup(),
      this._trainLight.setup(),
    ]);
    console.log("Done Loading 3D Models!");
    // } catch (error) {
    //   console.warn(`:( We had a problem loading the 3D Models: ${error}`);
    // }
    return true;
  };
}

export default new ModelLoader();
