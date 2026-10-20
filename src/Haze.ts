import { Box, voxelModel } from "./Voxel";
import { flatText, wallText } from "./PixelFont";
import { merlion, promenadeBoxes, vehicles as singaporeVehicles } from "./Singapore";

// "Haze" mode: Singapore during the 2026 haze (smoke from fires in
// Kalimantan and Sumatra, PSI up to 192). Same level and gameplay, but a
// yellow-grey smog, people in N95 masks and anti-pollution gear.
// Units are 1/16 of a tile (see Voxel.ts); sizes match the models replaced.

export const HAZE_COLOR = 0xc9b78f;

const HALF = 200;
const MASK = 0xf5f5f5;
const STRAP = 0x4f83cc;
const ASH = 0x5f5a55;
const EMBER = 0xff7043;

// ---------- Ground: the promenade under a layer of ash ----------

export function hazeGround(variant: number) {
  const boxes = promenadeBoxes(variant, {
    base: 0xa9a291,
    granite: [0xbcb5a4, 0xb1a993, 0xc3bcab],
    timber: [0x7d5a3c, 0x6d4f35],
  });
  // ash flecks settled on the ground
  for (let x = -HALF + 5, i = 0; x < HALF; x += 7 + (i % 5), i++) {
    boxes.push([x, 6, ((i * 7) % 13) - 7, 0.8 + (i % 3) * 0.4, 0.05, 0.8, i % 4 ? 0x8f887a : ASH]);
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// ---------- River: murky water with floating ash ----------

export function murkyRiver() {
  const boxes: Box[] = [[-HALF, 0, -8, HALF * 2, 2, 16, 0x5f6e66]];
  for (let x = -HALF + 3, i = 0; x < HALF; x += 6 + (i % 4), i++) {
    boxes.push([x, 2, ((i * 5) % 14) - 7, 1 + (i % 2), 0.05, 0.7, i % 3 ? 0x7c8780 : 0x4a4f4b]);
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// Rows of N95 mask boxes floating down the river (replace the dragon boats).
function maskBox(cx: number): Box[] {
  return [
    [cx - 7, 2, -4, 14, 3.5, 8, 0xfafafa],
    [cx - 7.05, 3, -4.05, 14.1, 1, 8.1, STRAP], // blue band
    ...flatText("N95", cx, 5.5, 0, 0x1e4fa3, 0.7, 0.1),
  ];
}

function maskBoxRow(tiles: number): Box[] {
  const L = tiles === 4 ? 62 : tiles * 16;
  const step = L / tiles;
  const boxes: Box[] = [];
  for (let i = 0; i < tiles; i++) boxes.push(...maskBox(-L / 2 + step * (i + 0.5)));
  return boxes;
}

export const maskBoxRows = () =>
  [1, 2, 3, 4].map((t) => voxelModel(maskBoxRow(t), { castShadow: true, receiveShadow: true }));

// N95 masks floating on the water (replace the MacBooks).
function floatingMask(): Box[] {
  return [
    [-3.5, 0, -3, 7, 1.2, 6, MASK],
    [-2.5, 1.2, -2, 5, 1, 4, MASK], // cup shape
    [-1, 2.2, -1, 2, 0.4, 2, 0xe0e0e0], // valve
    [-4.5, 0.6, -2.4, 9, 0.2, 0.4, STRAP], // straps
    [-4.5, 0.6, 2, 9, 0.2, 0.4, STRAP],
  ];
}

export const floatingMasks = () => [
  voxelModel(floatingMask(), { castShadow: true, receiveShadow: true }),
];

// ---------- Decor (replaces trees) ----------

// Tree burnt by the forest fires: charred trunk, a few dry leaves.
function burntTree(tall: boolean): Box[] {
  const trunk = 0x3b3330;
  const h = tall ? 20 : 14;
  return [
    [-1, 0, -1, 2, h, 2, trunk],
    [-4, h - 6, -0.5, 3, 0.8, 1, trunk], // bare branches
    [1, h - 4, -0.5, 3.5, 0.8, 1, trunk],
    [-4, h - 6, -0.5, 0.8, 3, 1, trunk],
    [3.7, h - 4, -0.5, 0.8, 3, 1, trunk],
    [-0.5, h, -0.5, 1, 3, 1, trunk],
    [-4.5, h - 3, -1, 1.5, 1, 1.5, 0x8d6e3f], // dry leaves
    [3.4, h - 1, 0, 1.5, 1, 1.5, 0xa1804a],
    [-1.5, 0, -1.5, 3, 0.6, 3, ASH],
    [0.6, 0.6, -1.4, 0.6, 0.4, 0.4, EMBER], // still smouldering
  ];
}

// Air purifier tower with its blue light ring.
function airPurifier(): Box[] {
  const boxes: Box[] = [
    [-3, 0, -3, 6, 12, 6, 0xf2f2f2],
    [-3.05, 9.5, -3.05, 6.1, 0.6, 6.1, 0x29b6f6], // light ring
    [-2.5, 12, -2.5, 5, 0.4, 5, 0x9e9e9e], // top grille
    [-1, 6.5, -3.1, 2, 1.5, 0.1, 0x263238], // display
  ];
  for (let y = 1.5; y < 9; y += 1.2) {
    boxes.push([-2.5, y, -3.08, 5, 0.3, 0.1, 0xbdbdbd]); // intake slots
  }
  return boxes;
}

// Roadside sign showing the 24-hour PSI (192, the 2026 peak) in the
// "unhealthy" orange. Faces -z, the camera.
function psiSign(): Box[] {
  return [
    [-0.5, 0, -0.5, 1, 14, 1, 0x9e9e9e],
    [-6, 14, -0.6, 12, 9, 1.2, 0x212121],
    ...wallText("PSI", 0, 20.5, -0.6, 0xffffff, 0.55, 0.12),
    ...wallText("192", 0, 16.6, -0.6, 0xff7043, 0.7, 0.12),
  ];
}

export const hazeTrees = () =>
  [burntTree(true), burntTree(false), airPurifier(), psiSign()].map((b) => voxelModel(b));

// ---------- Obstacles (replace the Merlion, professor, exam papers) ----------

// The Merlion wearing an N95 mask (no water spout while it is masked).
function maskedMerlion(): Box[] {
  return [
    ...merlion().filter((b) => b[6] !== 0x6ec6ff),
    [-2.4, 9.2, -3.7, 4.8, 2, 0.7, MASK],
    [-3.2, 10.6, -3.2, 0.4, 0.4, 3, STRAP],
    [2.8, 10.6, -3.2, 0.4, 0.4, 3, STRAP],
  ];
}

function maskBoxStack(): Box[] {
  const box = (x: number, y: number, z: number): Box[] => [
    [x - 3, y, z - 2.5, 6, 3, 5, 0xfafafa],
    [x - 3.05, y + 1, z - 2.55, 6.1, 0.8, 5.1, STRAP],
  ];
  return [
    ...box(-2.5, 0, 0),
    ...box(2.5, 0, 0.5),
    ...box(0, 3, 0.2),
    ...wallText("N95", 0, 4.5, -2.35, 0x1e4fa3, 0.4, 0.1),
  ];
}

// Pile of ash still smoking.
function smokingAsh(): Box[] {
  const smoke = [0xbdbdbd, 0xa8a8a8, 0xcfcfcf];
  const boxes: Box[] = [
    [-4, 0, -3, 8, 1.5, 6, ASH],
    [-2.5, 1.5, -2, 5, 1, 4, 0x4e4a46],
    [-1, 2.5, -1, 2, 0.5, 2, EMBER],
  ];
  for (let i = 0; i < 6; i++) {
    const s = 1.5 + i * 0.4;
    boxes.push([-s / 2 + Math.sin(i) * 1.2, 3 + i * 2.2, -s / 2, s, 1.8, s, smoke[i % 3]]);
  }
  return boxes;
}

// NEA air-quality monitoring station: sensor box on a pole with a solar panel.
function airMonitor(): Box[] {
  return [
    [-0.5, 0, -0.5, 1, 10, 1, 0x9e9e9e],
    [-2.5, 10, -2, 5, 4, 4, 0xeceff1],
    [-2, 11, -2.1, 4, 0.8, 0.1, 0x43a047], // status light
    [-3, 14.5, -2.5, 6, 0.4, 5, 0x1a3a6b], // solar panel
    [-0.3, 14, -0.3, 0.6, 0.5, 0.6, 0x9e9e9e],
    [1.5, 8, -1.5, 1, 2, 1, 0xbdbdbd], // air intake
  ];
}

export const hazeObstacles = () =>
  [maskedMerlion(), maskBoxStack(), smokingAsh(), airMonitor()].map((b) => voxelModel(b));

// ---------- Vehicles: the Singapore traffic plus an SCDF ambulance ----------

// SCDF ambulance (7th generation, white with blue strips), front on +z.
function ambulance(): Box[] {
  return [
    [-8, 0, -8, 16, 3, 4, 0x222222],
    [-8, 0, 4, 16, 3, 4, 0x222222],
    [-7.5, 2, -10, 15, 11, 15, 0xfafafa], // patient compartment
    [-7, 2, 5, 14, 7, 5, 0xfafafa], // cab
    [-6, 5.5, 9.8, 12, 3, 0.3, 0x2b3a4a], // windscreen
    [-7.7, 4, -10, 15.4, 1.5, 20, 0x1565c0], // blue strips
    [-7.7, 6, -10, 15.4, 0.6, 15, 0xd32f2f],
    [-1.5, 8.5, -7.7, 3, 3, 0.1, 0xd32f2f], // cross on the side
    [-5, 13, -2, 10, 1, 2, 0xd32f2f], // light bar
    [-1, 13, -2, 2, 1, 2, 0x1e88e5],
    [-6, 4, 10, 3, 1.5, 0.3, 0xfff6c8],
    [3, 4, 10, 3, 1.5, 0.3, 0xfff6c8],
  ];
}

export const hazeVehicles = { ...singaporeVehicles, police_car: ambulance };
