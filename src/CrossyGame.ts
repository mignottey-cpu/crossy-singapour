import { Renderer } from "expo-three";
import { TweenMax } from "gsap";
import { Vibration } from "react-native";
import {
  AmbientLight,
  DirectionalLight,
  Group,
  OrthographicCamera,
  Scene,
} from "three";

import * as THREE from "three";

import AudioManager from "./AudioManager";
import { MAP_OFFSET, maxRows, startingRow } from "./GameSettings";
import Feathers from "./Particles/Feathers";
import Water from "./Particles/Water";
import ModelLoader from "./ModelLoader";
import Rows from "./Row";
import { Fill } from "./Row/Grass";

// TODO Add to state - disable/enable when battery is low
const useParticles = true;
const useShadows = true;

export class CrossyScene extends Scene {
  world: CrossyWorld;
  worldWithCamera: Group;
  constructor({ gl }) {
    super();
    this.__gl = gl;

    this.worldWithCamera = new Group();
    this.world = new CrossyWorld();
    this.worldWithCamera.add(this.world);
    this.add(this.worldWithCamera);

    const light = new DirectionalLight(0xffffff, 1.0);
    light.position.set(20, 30, 0.05);
    light.castShadow = useShadows;
    light.shadow.mapSize.width = 1024 * 2;
    light.shadow.mapSize.height = 1024 * 2;

    const d = 15;
    const v = 6;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = 9;
    light.shadow.camera.top = v;
    light.shadow.camera.bottom = -v;
    light.shadow.camera.far = 100;
    light.shadow.bias = 0.0001;

    this.add(light);

    this.light = light;

    // let helper = new CameraHelper(light.shadow.camera);
    // this.add(helper);
  }

  setShadowsEnabled(enabled) {
    this.light.castShadow = enabled;
  }

  resetParticles = (position) => {
    if (!useParticles) return;
    this.featherParticles.mesh.position.copy(position);
    this.waterParticles.mesh.position.copy(position);
    this.featherParticles.mesh.position.y = 0;
    this.waterParticles.mesh.position.y = 0;
  };

  useParticle = (model, type, direction = 0) => {
    if (!useParticles) return;
    requestAnimationFrame(async () => {
      if (type === "water") {
        this.waterParticles.mesh.position.copy(model.position);
        this.waterParticles.run(type);
        await AudioManager.playAsync(AudioManager.sounds.water);
      } else if (type === "feathers") {
        this.featherParticles.mesh.position.copy(model.position);
        this.featherParticles.run(type, direction);
      }
    });
  };

  waterParticles: Water | undefined;
  featherParticles: Feathers | undefined;

  createParticles = () => {
    if (!useParticles) return;

    this.waterParticles = new Water();
    this.world.add(this.waterParticles.mesh);

    this.featherParticles = new Feathers();
    this.world.add(this.featherParticles.mesh);
  };

  rumble = () => {
    Vibration.vibrate();

    TweenMax.to(this.position, 0.2, {
      x: 0,
      y: 0,
      z: 1,
    });
    TweenMax.to(this.position, 0.2, {
      x: 0,
      y: 0,
      z: 0,
      delay: 0.2,
    });
  };
}

export class CrossyCamera extends OrthographicCamera {
  constructor() {
    super(-1, 1, 1, -1, -30, 30);
    this.position.set(-1, 2.8, -2.9); // Change -1 to -.02
    this.lookAt(0, 0, 0);
  }

  updateScale = ({ width, height, scale }) => {
    this.left = -(width * scale);
    this.right = width * scale;
    this.top = height * scale;
    this.bottom = -(height * scale);
    this.zoom = 400;
    this.updateProjectionMatrix();
  };
}

export class CrossyWorld extends Group {
  constructor() {
    super();

    this.add(new AmbientLight(0xffffff, 1.8));
  }

  createParticles = () => {
    this.waterParticles = new Water();
    this.add(this.waterParticles.mesh);

    this.featherParticles = new Feathers();
    this.add(this.featherParticles.mesh);
  };
}

export class CrossyRenderer extends Renderer {
  constructor(props) {
    super(props);
    this.__gl = props.gl;
    this.setShadowsEnabled(useShadows);

    // Set proper color space for vibrant colors
    this.outputColorSpace = THREE.SRGBColorSpace;
  }

  setShadowsEnabled(enabled) {
    this.shadowMap.enabled = enabled;
  }
}

export class GameMap {
  floorMap = {};

  reset() {
    this.floorMap = {};
  }

  getRow(index) {
    return this.floorMap[`${index}`];
  }
  setRow(index, value) {
    this.floorMap[`${index}`] = value;
  }

  // Detect collisions with trees/cars
  treeCollision = (position) => {
    const targetZ = `${position.z | 0}`;
    if (targetZ in this.floorMap) {
      const { type, entity } = this.floorMap[targetZ];
      if (type === "grass") {
        const key = `${position.x | 0}`;
        if (key in entity.obstacleMap) {
          return true;
        }
      }
    }

    return false;
  };
}

export class EntityContainer {
  items = [];
  count = 0;
}

// Columns of the playable area (the walls start at x = 5).
const COLUMNS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

// Chance that a grass or road row ahead of the start holds a coin.
const COIN_CHANCE = 0.3;

export class CrossyGameMap extends GameMap {
  // Columns of the last generated row that the player can reach from the
  // start. Each new row is built so that this never becomes empty: there is
  // always a way forward.
  reachable: number[] = COLUMNS;

  grasses = new EntityContainer();
  water = new EntityContainer();
  roads = new EntityContainer();
  railRoads = new EntityContainer();
  rowCount = 0;

  constructor({ heroWidth, onCollide, scene }) {
    super();

    this.heroWidth = heroWidth;

    // Assign mesh to corresponding array
    // and add mesh to scene
    for (let i = 0; i < maxRows; i++) {
      this.grasses.items[i] = new Rows.Grass(this.heroWidth);
      this.water.items[i] = new Rows.Water(this.heroWidth, onCollide);
      this.roads.items[i] = new Rows.Road(this.heroWidth, onCollide);
      this.railRoads.items[i] = new Rows.RailRoad(this.heroWidth, onCollide);
      scene.world.add(this.grasses.items[i]);
      scene.world.add(this.water.items[i]);
      scene.world.add(this.roads.items[i]);
      scene.world.add(this.railRoads.items[i]);
    }
  }

  // Puts a coin on the row (on one of `columns`) once in a while, after
  // removing the coin it may still hold from an earlier use of the row.
  placeCoin = (entity, columns: number[]) => {
    this.removeCoin(entity);
    if (this.rowCount <= startingRow || !columns.length) return;
    if (Math.random() > COIN_CHANCE) return;
    const x = columns[Math.floor(Math.random() * columns.length)];
    const mesh = ModelLoader._coin.getNode();
    mesh.position.set(x, entity.top + 0.05, 0);
    entity.add(mesh);
    entity.coin = { x, mesh };
  };

  removeCoin = (entity) => {
    if (entity.coin) {
      entity.remove(entity.coin.mesh);
      entity.coin = null;
    }
  };

  tick(dt, hero) {
    // coins spin on themselves
    for (const row of [...this.grasses.items, ...this.roads.items]) {
      if (row.coin) row.coin.mesh.rotation.y += 0.05;
    }
    for (const railRoad of this.railRoads.items) {
      railRoad.update(dt, hero);
    }
    for (const road of this.roads.items) {
      road.update(dt, hero);
    }
    for (const water of this.water.items) {
      water.update(dt, hero);
    }
  }

  // Columns of a grass row the player can reach: free cells right above a
  // reachable cell, plus everything walkable sideways from them.
  reachableInGrass = (grassEntity, below: number[]): number[] => {
    const blocked = new Set(grassEntity.getBlockedPositions());
    const reached = new Set<number>();
    for (const start of below) {
      if (blocked.has(start)) continue;
      for (const step of [-1, 1]) {
        for (let x = start; COLUMNS.includes(x) && !blocked.has(x); x += step) {
          reached.add(x);
        }
      }
    }
    return COLUMNS.filter((x) => reached.has(x));
  };

  // Scene generators
  newRow = (rowKind) => {
    if (this.grasses.count === maxRows) {
      this.grasses.count = 0;
    }
    if (this.roads.count === maxRows) {
      this.roads.count = 0;
    }
    if (this.water.count === maxRows) {
      this.water.count = 0;
    }
    if (this.railRoads.count === maxRows) {
      this.railRoads.count = 0;
    }
    if (this.rowCount < 10) {
      rowKind = "grass";
    }

    const ROW_TYPES = ["grass", "roadtype", "water"];
    if (rowKind == null) {
      rowKind = ROW_TYPES[Math.floor(Math.random() * ROW_TYPES.length)];
    }

    // Get the previous row info for coordination
    const previousRow = this.getRow(this.rowCount - 1);
    const below = this.reachable;

    switch (rowKind) {
      case "grass":
        this.grasses.items[this.grasses.count].position.z = this.rowCount;

        // If previous row is water, ensure lily pad positions are kept clear
        let requiredClearPositions: number[] = [];
        if (previousRow && previousRow.type === "water") {
          requiredClearPositions = previousRow.entity.getLilyPadPositions();
        }

        const grass = this.grasses.items[this.grasses.count];
        grass.generate(
          this.mapRowToObstacle(this.rowCount),
          requiredClearPositions
        );
        // Never let the obstacles close the way: if no column can be reached,
        // clear one straight above a reachable column.
        if (this.rowCount < startingRow) {
          this.reachable = COLUMNS; // behind the start: the walls stay closed
        } else if (this.rowCount === startingRow) {
          // the player starts in the middle of this row
          this.reachable = this.reachableInGrass(grass, [0]);
        } else {
          this.reachable = this.reachableInGrass(grass, below);
          if (this.reachable.length === 0 && below.length > 0) {
            grass.removeObstacle(below[Math.floor(Math.random() * below.length)]);
            this.reachable = this.reachableInGrass(grass, below);
          }
        }
        this.placeCoin(grass, this.reachable);
        this.setRow(this.rowCount, {
          type: "grass",
          entity: this.grasses.items[this.grasses.count],
        });
        this.grasses.count++;
        break;
      case "roadtype":
        if (((Math.random() * 4) | 0) === 0) {
          this.railRoads.items[this.railRoads.count].position.z = this.rowCount;
          this.railRoads.items[this.railRoads.count].active = true;
          this.setRow(this.rowCount, {
            type: "railRoad",
            entity: this.railRoads.items[this.railRoads.count],
          });
          this.railRoads.count++;
          this.reachable = COLUMNS; // the player can walk along the track
        } else {
          this.roads.items[this.roads.count].position.z = this.rowCount;

          const previousRowType = (this.getRow(this.rowCount - 1) || {}).type;
          this.roads.items[this.roads.count].isFirstLane(
            previousRowType !== "road"
          );
          this.roads.items[this.roads.count].active = true;
          this.setRow(this.rowCount, {
            type: "road",
            entity: this.roads.items[this.roads.count],
          });
          this.placeCoin(this.roads.items[this.roads.count], COLUMNS);
          this.roads.count++;
          this.reachable = COLUMNS; // the player can walk along the road
        }
        break;
      case "water":
        this.water.items[this.water.count].position.z = this.rowCount;
        this.water.items[this.water.count].active = true;

        // At least one lily pad must be reachable from the row below.
        const water = this.water.items[this.water.count];
        water.generate(below);
        if (water.isStaticRow(this.rowCount)) {
          // lily pads cannot be left sideways: only those above a reachable
          // column count
          this.reachable = water
            .getLilyPadPositions()
            .filter((x) => below.includes(x));
        } else {
          this.reachable = COLUMNS; // drifting boats pass every column
        }
        this.setRow(this.rowCount, {
          type: "water",
          entity: this.water.items[this.water.count],
        });
        this.water.count++;
        break;
    }

    this.rowCount++;
  };

  reset() {
    this.reachable = COLUMNS;
    this.grasses.count = 0;
    this.water.count = 0;
    this.roads.count = 0;
    this.railRoads.count = 0;

    this.rowCount = 0;
    super.reset();
  }

  // Setup initial scene
  init = () => {
    for (let i = 0; i < maxRows; i++) {
      this.grasses.items[i].position.z = MAP_OFFSET;
      this.removeCoin(this.grasses.items[i]); // coins left from the last game
      this.removeCoin(this.roads.items[i]);

      this.water.items[i].position.z = MAP_OFFSET;
      this.water.items[i].active = false;
      this.roads.items[i].position.z = MAP_OFFSET;
      this.roads.items[i].active = false;
      this.railRoads.items[i].position.z = MAP_OFFSET;
      this.railRoads.items[i].active = false;
    }

    this.grasses.items[this.grasses.count].position.z = this.rowCount;
    this.grasses.items[this.grasses.count].generate(
      this.mapRowToObstacle(this.rowCount)
    );
    this.grasses.count++;
    this.rowCount++;

    for (let i = 0; i < maxRows + 3; i++) {
      this.newRow();
    }
  };

  mapRowToObstacle = (row) => {
    if (this.rowCount < 5) {
      return Fill.solid;
    } else if (this.rowCount < 10) {
      return Fill.empty;
    }
    return Fill.random;
  };
}
