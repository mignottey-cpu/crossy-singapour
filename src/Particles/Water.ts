import { Power1, TweenMax } from "gsap";
import {
  BoxGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  RingGeometry,
} from "three";

import { isExam } from "../Theme";

export default class Water {
  constructor() {
    this.waterMat = new MeshPhongMaterial({
      // splash in the colour of the water (ink blue in exam mode)
      color: isExam() ? 0x5068c0 : 0x71d7ff,
      // shading: FlatShading,
      flatShading: true,
    });
    this.mesh = new Group();
    const size = 0.2;
    const bigParticleGeom = new BoxGeometry(size, size + 0.1, size, 1);
    // var smallParticleGeom = new BoxGeometry(0.1, 0.1, 0.1, 1);
    this.parts = [];
    for (let i = 0; i < 15; i++) {
      let partPink = new Mesh(bigParticleGeom, this.waterMat);
      // var partGreen = new Mesh(smallParticleGeom, this.waterMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }

    // ripple spreading on the surface
    this.ringMat = new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: DoubleSide,
    });
    this.ring = new Mesh(new RingGeometry(0.3, 0.42, 24), this.ringMat);
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.y = 0.2;
    this.ring.visible = false;
    this.mesh.add(this.ring);
  }

  run = () => {
    const explosionSpeed = 0.3;

    this.ring.visible = true;
    this.ring.scale.set(0.5, 0.5, 0.5);
    this.ringMat.opacity = 0.8;
    TweenMax.to(this.ring.scale, 1.2, { x: 3, y: 3, z: 3 });
    TweenMax.to(this.ringMat, 1.2, {
      opacity: 0,
      onComplete: () => (this.ring.visible = false),
    });

    const removeParticle = (p) => {
      p.visible = false;
    };

    for (let i = 0; i < this.parts.length; i++) {
      // a lower, wider splash than the original
      let tx = (Math.random() - 0.5) * 1.6;
      let ty = Math.random() * 0.9 + 0.6;
      let tz = (Math.random() - 0.5) * 1.6;
      let p = this.parts[i];

      const bezier = {
        type: "cubic",
        values: [
          { x: 0, y: 0, z: 0 },

          { x: tx, y: ty, z: tz },
          { x: tx * 0.8, y: ty * 0.8, z: tz * 0.8 },

          {
            x: tx * (Math.random() * 0.5 + 1.1),
            y: 0,
            z: tz * (Math.random() * 0.5 + 1.1),
          },
        ],
        curviness: 0,
      };

      p.position.set(0, 0, 0);
      p.scale.set(1, 1, 1);
      p.visible = true;
      const s = explosionSpeed + Math.random() * 0.5;

      TweenMax.to(p.position, s * 4, {
        bezier,
        ease: Power1.easeOut,
      });

      const scaleTo = 0.01;
      TweenMax.to(p.scale, s, {
        x: scaleTo,
        y: scaleTo,
        z: scaleTo,
        onComplete: removeParticle,
        onCompleteParams: [p],
        delay: s * 3,
      });
    }
  };
}
