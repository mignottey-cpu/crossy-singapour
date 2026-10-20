import { Box3, Group } from "three";

import Generic from "./Generic";
import { pelotonPieces } from "../Cycling";
import { studentRushPieces } from "../Exam";
import { mrtPieces } from "../Singapore";
import { loveTrainPieces } from "../Love";
import { byTheme } from "../Theme";

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

  // The train is an MRT train, students in suits rushing to the exam in exam
  // mode, or a peloton of cyclists wearing masks in haze mode.
  setup = async () => {
    this.models = byTheme({
      singapore: mrtPieces,
      exam: studentRushPieces,
      haze: () => pelotonPieces(true),
      love: loveTrainPieces,
    })();
    return this.models;
  };
}
