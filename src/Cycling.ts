import { Box, voxelModel } from "./Voxel";

// Cycling path (replaces the railroad) and a peloton of cyclists (replaces the
// train), styled after Singapore's Park Connector Network: a cycling lane
// outlined in red with cyclist icons, next to a footpath.
// Units are 1/16 of a tile (see Voxel.ts).

const PATH = 0x6b7078;
const FOOTPATH = 0xb9b4aa;
const RED_LINE = 0xc62828;
const MARKING = 0xf5f5f5;
const KERB = 0x9e9e9e;

const HALF = 200; // the row is 25 tiles wide

// Small cyclist icon painted on the lane, seen from above.
function bikeIcon(x: number, y: number, z: number): Box[] {
  return [
    [x - 3, y, z - 1, 2, 0.1, 2, MARKING], // rear wheel
    [x + 1, y, z - 1, 2, 0.1, 2, MARKING], // front wheel
    [x - 1, y, z - 0.3, 2, 0.1, 0.6, MARKING], // frame
    [x - 0.5, y, z - 0.3, 0.6, 0.1, 1.8, MARKING], // rider
  ];
}

function walkerIcon(x: number, y: number, z: number): Box[] {
  return [
    [x - 0.5, y, z - 1.5, 1, 0.1, 2, MARKING],
    [x - 0.5, y, z + 0.8, 1, 0.1, 1, MARKING],
  ];
}

export function cyclePath() {
  const top = 8;
  const boxes: Box[] = [
    [-HALF, 0, -8, HALF * 2, top, 10, PATH], // cycling lane
    [-HALF, 0, 2, HALF * 2, top, 6, FOOTPATH], // footpath
    [-HALF, top, -7.5, HALF * 2, 0.1, 0.5, RED_LINE], // red edge lines
    [-HALF, top, 1.2, HALF * 2, 0.1, 0.5, RED_LINE],
    [-HALF, 0, -8.3, HALF * 2, top + 0.3, 0.6, KERB],
    [-HALF, 0, 7.7, HALF * 2, top + 0.3, 0.6, KERB],
  ];
  // dashed centre line of the cycling lane
  for (let x = -HALF; x < HALF; x += 12) {
    boxes.push([x, top, -3.3, 6, 0.1, 0.4, MARKING]);
  }
  // cyclist icons on the lane and pedestrian icons on the footpath
  for (let x = -HALF + 24; x < HALF; x += 48) {
    boxes.push(...bikeIcon(x, top, -5.5));
    boxes.push(...walkerIcon(x + 24, top, 5));
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// ---------- Cyclists ----------

type Kit = { jersey: number; sleeve: number; helmet: number; bike: number };

const KITS: Kit[] = [
  { jersey: 0xe53935, sleeve: 0xffffff, helmet: 0xffffff, bike: 0x212121 }, // red & white
  { jersey: 0x1e88e5, sleeve: 0x0d47a1, helmet: 0x1e88e5, bike: 0xeeeeee },
  { jersey: 0x43a047, sleeve: 0x1b5e20, helmet: 0xffffff, bike: 0x212121 },
  { jersey: 0xec407a, sleeve: 0xec407a, helmet: 0x212121, bike: 0xec407a },
  { jersey: 0x212121, sleeve: 0x00bcd4, helmet: 0x00bcd4, bike: 0x00bcd4 },
];
const LEADER: Kit = {
  jersey: 0xffd600, // yellow jersey
  sleeve: 0xffd600,
  helmet: 0xffd600,
  bike: 0x212121,
};
const SKINS = [0xf0c8a0, 0xd9a066, 0x8d5524];

const BASE = 1.6; // the path is a bit higher than the train's ground level

// A road cyclist riding towards +x, centred on (b, z).
function cyclist(b: number, z: number, kit: Kit, skin: number): Box[] {
  const y = BASE;
  const wheel = (cx: number): Box[] => [
    [cx - 2.5, y + 1, z - 0.2, 5, 3, 0.4, 0x1a1a1a],
    [cx - 1.5, y, z - 0.2, 3, 5, 0.4, 0x1a1a1a],
    [cx - 0.5, y + 2, z - 0.3, 1, 1, 0.6, 0xb0b4b8],
  ];
  return [
    ...wheel(b - 3),
    ...wheel(b + 3.5),
    // frame
    [b - 3, y + 2.3, z - 0.2, 4, 0.5, 0.4, kit.bike],
    [b - 1, y + 2.3, z - 0.2, 0.6, 3.2, 0.4, kit.bike],
    [b - 1, y + 5, z - 0.2, 4.5, 0.6, 0.4, kit.bike],
    [b + 0.5, y + 2.6, z - 0.2, 3, 0.6, 0.4, kit.bike],
    [b + 3.2, y + 2.5, z - 0.2, 0.5, 3.5, 0.4, kit.bike],
    [b + 3.2, y + 5.6, z - 1.2, 0.6, 0.5, 2.4, 0x1a1a1a], // handlebar
    [b - 1.6, y + 5.6, z - 0.5, 1.6, 0.4, 1, 0x1a1a1a], // saddle
    // legs (black shorts) and shoes
    [b - 1.2, y + 3, z - 1, 1.3, 3, 0.7, 0x1a1a1a],
    [b - 0.4, y + 2, z + 0.3, 1.3, 3.5, 0.7, 0x1a1a1a],
    [b - 0.6, y + 1.5, z - 1.1, 1.6, 0.6, 0.8, MARKING],
    [b + 0.2, y + 1.2, z + 0.3, 1.6, 0.6, 0.8, MARKING],
    // torso leaning forward over the bars
    [b - 1.5, y + 6, z - 1, 2.5, 2, 2, kit.jersey],
    [b + 0.5, y + 6.8, z - 1, 2.5, 1.6, 2, kit.jersey],
    [b + 1.5, y + 7, z - 1.4, 1, 1, 0.5, kit.sleeve],
    [b + 1.5, y + 7, z + 0.9, 1, 1, 0.5, kit.sleeve],
    [b + 2.3, y + 5.6, z - 1.4, 1, 1.6, 0.5, skin], // arms
    [b + 2.3, y + 5.6, z + 0.9, 1, 1.6, 0.5, skin],
    // head, helmet, sunglasses
    [b + 2.6, y + 7.8, z - 0.9, 1.8, 1.8, 1.8, skin],
    [b + 2.2, y + 9.3, z - 1.1, 2.6, 0.9, 2.2, kit.helmet],
    [b + 4.3, y + 8.6, z - 0.8, 0.2, 0.5, 1.6, 0x111111],
  ];
}

// Team car following the peloton, with spare bikes on the roof.
function teamCar(cx: number, z: number): Box[] {
  const y = BASE;
  const spareBike = (bz: number): Box[] => [
    [cx - 5, y + 11, bz - 0.2, 4, 3, 0.4, 0x1a1a1a],
    [cx + 1, y + 11, bz - 0.2, 4, 3, 0.4, 0x1a1a1a],
    [cx - 3, y + 13, bz - 0.2, 6, 0.5, 0.4, 0xe53935],
  ];
  return [
    [cx - 9, y - 1.6, z - 6.5, 4, 3.5, 13, 0x1a1a1a], // wheels
    [cx + 5, y - 1.6, z - 6.5, 4, 3.5, 13, 0x1a1a1a],
    [cx - 11, y, z - 6, 22, 5, 12, 0xf5f5f5],
    [cx - 11, y + 2, z - 6.1, 22, 1, 12.2, 0xe53935], // team stripe
    [cx - 5, y + 5, z - 5, 10, 4, 10, 0x2b3a4a],
    [cx - 5, y + 9, z - 5, 10, 0.6, 10, 0xf5f5f5],
    [cx - 5, y + 9.6, z - 4, 10, 0.4, 0.4, 0x444444], // roof rack
    [cx - 5, y + 9.6, z + 3.6, 10, 0.4, 0.4, 0x444444],
    [cx + 10.8, y + 2.5, z - 5, 0.3, 1.5, 3, 0xfff6c8],
    [cx + 10.8, y + 2.5, z + 2, 0.3, 1.5, 3, 0xfff6c8],
    ...spareBike(z - 3),
    ...spareBike(z + 2),
  ];
}

const LANES = [-6, -1.5];
const pick = <T>(list: T[], i: number) => list[i % list.length];

// A bunch of riders two abreast; `offset` varies the team colours per piece.
function bunch(xs: number[], offset: number): Box[] {
  const boxes: Box[] = [];
  xs.forEach((x, i) => {
    LANES.forEach((z, lane) => {
      const kit = pick(KITS, i + lane * 2 + offset);
      const skin = pick(SKINS, i * 2 + lane + offset);
      boxes.push(...cyclist(x + lane * 7, z, kit, skin));
    });
  });
  return boxes;
}

// The train is built from pieces laid out along +x and moves towards +x:
// "front" is at the tail, "back" leads the way.
export const pelotonPieces = () => ({
  front: voxelModel([...teamCar(-20, -3.75), ...bunch([4, 18, 32], 0)]),
  middle: voxelModel(bunch([-28, -14, 0, 14, 28], 1)),
  back: voxelModel([
    ...bunch([-30, -16], 3),
    ...cyclist(6, -3.75, LEADER, SKINS[0]), // yellow jersey breaking away
  ]),
});

// ---------- Cycling signs (replace the railroad crossing lights) ----------
// The row rotates them by PI, so the sign faces +z here.

function cyclingSign(left: boolean, right: boolean): Box[] {
  const off = 0x5a5a5a;
  const on = 0xffb300;
  return [
    [-0.5, 0, -0.5, 1, 24, 1, 0x9e9e9e], // post
    [-3, 17, 0.5, 6, 6, 0.3, 0x1565c0], // round-ish blue sign
    [-2.5, 16.5, 0.5, 5, 7, 0.3, 0x1565c0],
    [-3.5, 17.5, 0.5, 7, 5, 0.3, 0x1565c0],
    // white bicycle
    [-2.4, 18.2, 0.85, 1.6, 1.6, 0.1, MARKING],
    [0.8, 18.2, 0.85, 1.6, 1.6, 0.1, MARKING],
    [-1, 19.6, 0.85, 2.4, 0.4, 0.1, MARKING],
    [-0.2, 20, 0.85, 0.4, 1.2, 0.1, MARKING],
    // two warning lamps that flash when the peloton comes
    [-2.5, 24, -1, 2, 1.5, 2, left ? on : off],
    [0.5, 24, -1, 2, 1.5, 2, right ? on : off],
    [-3, 23.5, -1, 6, 0.5, 2, 0x333333],
  ];
}

export const cyclingSigns = () => ({
  inactive: voxelModel(cyclingSign(false, false)),
  active_0: voxelModel(cyclingSign(true, false)),
  active_1: voxelModel(cyclingSign(false, true)),
});
