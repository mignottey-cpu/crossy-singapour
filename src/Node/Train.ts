import { Box3, Group } from "three";

import Generic from "./Generic";
import { pelotonPieces } from "../Cycling";

export default class Train extends Generic {
  getDepth = (mesh) => {
    let box3 = new Box3();
    box3.setFromObject(mesh);

    return Math.round(box3.max.x - box3.min.x);
  };

  withSize = (size = 2) => {
    const _train = new Group();

    const front = this.getNode("front");
    _train.add(front);

    //

    // console.log( box.min, box.max, box.size() );
    let offset = this.getDepth(front);
    //
    for (let i = 0; i < size; i++) {
      const middle = this.getNode("middle");
      middle.position.x = offset; //TODO: Measure.

      _train.add(middle);
      offset += this.getDepth(middle);
    }
    const back = this.getNode("back");
    back.position.x = offset;
    _train.add(back);

    return _train;
  };

  // The train is now a peloton of cyclists (see Cycling.ts).
  setup = async () => {
    this.models = pelotonPieces();
    return this.models;
  };
}
