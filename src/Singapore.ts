import { Box, voxelModel } from "./Voxel";
import { wallText } from "./PixelFont";

// Voxel decor inspired by Singapore. Units are 1/16 of a tile (see Voxel.ts).
// The camera looks from -z, so "front" details are placed on the -z side.

const C = {
  supertreeTrunk: 0x5b2c6f,
  supertreeTrunkLight: 0x7d3c98,
  supertreeCanopy: 0xc0398f,
  supertreeRim: 0xff79c6,
  leaf: 0x3e8e41,
  leafDark: 0x2e6b31,
  leafLight: 0x6abf4b,
  wood: 0x7a4a2a,
  woodLight: 0xb07a4a,
  coconut: 0x5c3a1e,
  stone: 0x9e9e9e,
  merlion: 0xf2efe6,
  merlionMane: 0xe0d6bf,
  eye: 0x222222,
  water: 0x6ec6ff,
  durian: 0x9aa832,
  durianSpike: 0x6f7d1f,
  lanternRed: 0xd7261e,
  window: 0x2d4a6b,
  roofTile: 0xb5482b,
  boatHull: 0x8b2e1a,
  boatTrim: 0xf2c230,
  boatDeck: 0xc08a55,
  gold: 0xf2c230,
  white: 0xffffff,
};

// ---------- Trees (replace the original trees) ----------

// Supertree from Gardens by the Bay: purple trunk with a funnel-shaped canopy.
function supertree(height: number): Box[] {
  const boxes: Box[] = [
    [-2, 0, -2, 4, 4, 4, C.supertreeTrunk],
    [-1, 4, -1, 2, height - 8, 2, C.supertreeTrunkLight],
    // little plants climbing the trunk
    [-2, 6, -2, 1, 2, 1, C.leaf],
    [1, 10, 1, 1, 2, 1, C.leafLight],
    [-2, 13, 1, 1, 2, 1, C.leaf],
  ];
  const top = height - 8;
  for (let i = 0; i < 4; i++) {
    const r = 2 + i;
    boxes.push([-r, top + i * 2, -r, r * 2, 2, r * 2, C.supertreeCanopy]);
  }
  // glowing rim on top
  boxes.push([-6, top + 8, -6, 12, 1, 1, C.supertreeRim]);
  boxes.push([-6, top + 8, 5, 12, 1, 1, C.supertreeRim]);
  boxes.push([-6, top + 8, -5, 1, 1, 10, C.supertreeRim]);
  boxes.push([5, top + 8, -5, 1, 1, 10, C.supertreeRim]);
  return boxes;
}

function palmTree(): Box[] {
  return [
    [-1, 0, -1, 2, 8, 2, C.wood],
    [0, 8, -1, 2, 8, 2, C.woodLight],
    [-1, 16, -1, 2, 6, 2, C.wood],
    // fronds
    [-2, 22, -2, 4, 2, 4, C.leafDark],
    [-6, 23, -1, 12, 1, 2, C.leaf],
    [-1, 23, -6, 2, 1, 12, C.leaf],
    [-7, 21, -1, 1, 2, 2, C.leaf],
    [6, 21, -1, 1, 2, 2, C.leaf],
    [-1, 21, -7, 2, 2, 1, C.leaf],
    [-1, 21, 6, 2, 2, 1, C.leaf],
    // coconuts
    [-2, 20, -2, 1, 2, 1, C.coconut],
    [1, 20, 1, 1, 2, 1, C.coconut],
  ];
}

// Big umbrella-shaped rain tree, very common along Singapore's roads.
function rainTree(): Box[] {
  return [
    [-1, 0, -1, 2, 10, 2, C.wood],
    [-5, 10, -4, 10, 3, 8, C.leafDark],
    [-4, 13, -3, 8, 2, 6, C.leaf],
    [-2, 15, -2, 4, 1, 4, C.leafLight],
  ];
}

// Vanda Miss Joaquim, Singapore's national flower, in a terracotta pot:
// rosy-violet petals around a broad violet lip with an orange centre.
function orchidPot(): Box[] {
  const boxes: Box[] = [
    [-3, 0, -3, 6, 4, 6, 0xb5652f],
    [-3.3, 3.5, -3.3, 6.6, 1, 6.6, 0xc87941],
    [-2.5, 4, -2.5, 5, 0.3, 5, 0x5d4037], // soil
  ];
  const flower = (x: number, y: number, z: number): Box[] => [
    [x - 1.5, y, z - 0.4, 3, 1, 0.8, 0xe8a1d5], // petals
    [x - 0.5, y - 1, z - 0.4, 1, 3, 0.8, 0xe8a1d5],
    [x - 0.9, y - 0.4, z - 0.6, 1.8, 1.8, 0.4, 0xb4489a], // lip
    [x - 0.3, y + 0.1, z - 0.8, 0.6, 0.6, 0.3, 0xf08a3c],
  ];
  for (const [x, h, z] of [[-1.2, 11, -0.5], [1.4, 14, 0.4], [0, 8, 1]]) {
    boxes.push([x - 0.2, 4, z - 0.2, 0.4, h - 4, 0.4, C.leaf]); // stems
    boxes.push(...flower(x, h, z - 0.5), ...flower(x + 0.6, h - 2.5, z - 0.6));
  }
  boxes.push([-2.8, 4, -0.4, 5.6, 0.6, 0.8, C.leafLight]); // strap leaves
  return boxes;
}

export const trees = () => [
  voxelModel(supertree(30)),
  voxelModel(palmTree()),
  voxelModel(rainTree()),
  voxelModel(orchidPot()),
];

// ---------- Small obstacles (replace the boulders) ----------

export function merlion(): Box[] {
  return [
    [-4, 0, -3, 8, 3, 7, C.stone],
    // fish body
    [-2, 3, -1, 4, 6, 4, C.merlion],
    [-1, 3, 3, 2, 3, 2, C.merlion], // tail
    // lion head + mane
    [-3, 9, -2, 6, 5, 5, C.merlionMane],
    [-2, 9, -3, 4, 4, 1, C.merlion],
    [-2, 12, -4, 1, 1, 1, C.eye],
    [1, 12, -4, 1, 1, 1, C.eye],
    // water spout
    [-1, 10, -5, 2, 1, 1, C.water],
    [-1, 9, -6, 2, 1, 1, C.water],
    [-1, 6, -7, 2, 3, 1, C.water],
    [-1, 3, -7, 2, 3, 1, C.water],
  ];
}

function durian(): Box[] {
  const boxes: Box[] = [
    [-4, 0, -4, 8, 7, 8, C.durian],
    [0, 7, 0, 1, 2, 1, C.wood], // stem
  ];
  // spikes on every side
  for (const y of [1, 4]) {
    for (const o of [-3, 1]) {
      boxes.push([-5, y, o, 1, 2, 2, C.durianSpike]);
      boxes.push([4, y, o, 1, 2, 2, C.durianSpike]);
      boxes.push([o, y, -5, 2, 2, 1, C.durianSpike]);
      boxes.push([o, y, 4, 2, 2, 1, C.durianSpike]);
    }
  }
  boxes.push([-3, 7, -3, 2, 1, 2, C.durianSpike]);
  boxes.push([1, 7, 1, 2, 1, 2, C.durianSpike]);
  return boxes;
}

// Red lantern like the ones in Chinatown for Chinese New Year.
function lantern(): Box[] {
  return [
    [-3, 0, -3, 6, 1, 6, C.wood],
    [-1, 1, -1, 2, 2, 2, C.wood],
    [-3, 3, -3, 6, 1, 6, C.gold],
    [-4, 4, -4, 8, 6, 8, C.lanternRed],
    [-3, 10, -3, 6, 1, 6, C.gold],
    [-1, 6, -5, 2, 2, 1, C.gold], // 福 badge
    [-1, 11, -1, 2, 2, 2, C.gold],
  ];
}

// Hawker centre table: chicken rice, a kopi, and a packet of tissues to
// "chope" (reserve) the seat. Faces -z.
function hawkerTable(): Box[] {
  return [
    [-0.5, 0, -0.5, 1, 5, 1, 0x9e9e9e], // pedestal
    [-4.5, 5, -3, 9, 0.6, 6, 0xf2f2ee], // round-ish marble top
    [-3, 5, -4.5, 6, 0.6, 9, 0xf2f2ee],
    [-6.5, 0, -1, 2, 3, 2, 0x1565c0], // stools
    [4.5, 0, -1, 2, 3, 2, 0x1565c0],
    [-3, 5.6, -2, 3.4, 0.3, 3.4, 0xffffff], // plate
    [-2.6, 5.9, -1.6, 2.6, 1, 2.6, 0xfff8e1], // rice
    [-0.4, 5.9, -1.8, 1.6, 0.6, 2.6, 0xf5d48a], // steamed chicken
    [-2.8, 5.9, 0.6, 0.8, 0.4, 0.8, 0x7cb342], // cucumber
    [1.4, 5.6, 1, 1.4, 2, 1.4, 0xffffff], // kopi in a cup
    [1.5, 7.6, 1.1, 1.2, 0.1, 1.2, 0x6d4c41],
    [1.2, 5.6, -2.2, 2.2, 0.6, 1.4, 0xfafafa], // tissue packet
    [1.4, 6.2, -2, 1.8, 0.05, 1, 0x29b6f6],
  ];
}

export const obstacles = () =>
  [merlion(), durian(), hawkerTable(), lantern()].map((boxes) => voxelModel(boxes));

// ---------- Towers (line the edges of the map) ----------

const GLASS = 0xd6e2ec;
const GLASS_LINE = 0x9fb3c6;

// Horizontal window lines on a block, every `gap` units.
function floorLines(
  x: number, z: number, w: number, d: number, from: number, to: number,
  gap = 4, color = GLASS_LINE
): Box[] {
  const lines: Box[] = [];
  for (let y = from + gap - 1; y < to; y += gap) {
    lines.push([x - 0.1, y, z - 0.1, w + 0.2, 0.6, d + 0.2, color]);
  }
  return lines;
}

// Marina Bay Sands: three towers (each on two legs) with the SkyPark "ship" on top.
function marinaBaySands(): Box[] {
  const H = 40;
  const boxes: Box[] = [];
  for (const x of [-7, -1.5, 4]) {
    boxes.push([x, 0, -3.5, 3, H, 2.6, GLASS]);
    boxes.push([x, 0, 0.9, 3, H, 2.6, GLASS]);
    boxes.push([x, 26, -3.5, 3, H - 26, 7, GLASS]); // legs join near the top
    boxes.push(...floorLines(x, -3.5, 3, 7, 26, H));
    boxes.push(...floorLines(x, -3.5, 3, 2.6, 0, 26));
    boxes.push(...floorLines(x, 0.9, 3, 2.6, 0, 26));
  }
  boxes.push(
    [-8, H, -3, 18, 2, 6, 0xeef2f5], // SkyPark, cantilevered on one side
    [-7, H + 2, -2.8, 9, 0.4, 1.6, 0x3fa9f5], // infinity pool
    [3, H + 2, -2, 1.5, 2, 1.5, C.leaf],
    [6, H + 2, 0, 1.5, 2, 1.5, C.leaf],
    [-4, H + 2, 1, 1.5, 2, 1.5, C.leafLight]
  );
  return boxes;
}

// Pinnacle@Duxton: slender public-housing towers linked by sky bridges.
function pinnacleDuxton(): Box[] {
  const H = 44;
  const boxes: Box[] = [];
  for (const x of [-7, -2, 3]) {
    boxes.push([x, 0, -3, 4, H, 6, 0xe9e5dc]);
    boxes.push([x + 1.5, 0, -3.2, 1, H, 0.3, 0xc9c1b0]); // vertical fins
    boxes.push(...floorLines(x, -3, 4, 6, 0, H, 3, 0x8a9aa8));
  }
  boxes.push(
    [-7, 22, -2.5, 14, 2, 5, 0xd6cfbf], // sky bridge (26th floor)
    [-7, H, -3, 14, 2, 6, 0xd6cfbf], // sky bridge (50th floor)
    [-6.5, H + 2, -2.5, 13, 0.6, 5, C.leaf] // rooftop garden
  );
  return boxes;
}

// Esplanade - Theatres on the Bay, "the durian": two domes covered in
// spiky aluminium sunshades.
function esplanade(): Box[] {
  const shell = 0xd4c7a1;
  const spike = 0x8f7f55;
  const boxes: Box[] = [[-8, 0, -4.5, 16, 1.5, 9, 0xd8d2c4]];
  // a low, wide dome made of thin slices, studded with pointed sunshades
  const dome = (cx: number, r: number, h: number) => {
    for (let i = 0; i < h; i++) {
      const t = i / h;
      const w = r * Math.sqrt(1 - t * t);
      const d = w * 0.85;
      boxes.push([cx - w, 1.5 + i, -d, w * 2, 1, d * 2, shell]);
      for (let x = cx - w + 0.4 + (i % 2) * 0.8; x < cx + w - 0.6; x += 1.6) {
        boxes.push([x, 1.7 + i, -d - 0.35, 0.7, 0.6, 0.35, spike]); // facing the bay
      }
    }
    boxes.push([cx - 0.6, 1.5 + h, -0.6, 1.2, 0.5, 1.2, shell]);
  };
  dome(-2.5, 5.5, 9);
  dome(4.6, 3.6, 6);
  return boxes;
}

// Singapore Flyer: the giant observation wheel on Marina Bay, with its
// 28 capsules, on two legs above the terminal building. Faces -z.
function singaporeFlyer(): Box[] {
  const R = 11;
  const cy = 26;
  const boxes: Box[] = [
    [-7, 0, -4, 14, 6, 8, 0xe0e4e8], // terminal
    [-7, 6, -4, 14, 1, 8, 0x8fb7d4],
    [-1.5, 6, -1, 1, 14, 1, 0xb0bec5], // legs
    [0.5, 6, -1, 1, 14, 1, 0xb0bec5],
    [-1, cy - 1, -1.2, 2, 2, 2.4, 0x90a4ae], // hub
  ];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const x = Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    boxes.push([x - 0.6, y - 0.6, -0.4, 1.2, 1.2, 0.8, 0xcfd8dc]); // rim
    if (i % 2 === 0) {
      const sx = Math.cos(a) * (R / 2);
      const sy = cy + Math.sin(a) * (R / 2);
      boxes.push([sx - 0.2, sy - 0.2, -0.2, 0.4, 0.4, 0.4, 0xb0bec5]); // spokes
    }
    boxes.push([x - 0.7, y - 1.6, -1.2, 1.4, 1.2, 1.2, 0xe3f2fd]); // capsules
  }
  return boxes;
}

const HDB_COLORS = [0xf6d55c, 0x7fc8a9, 0xf4a261, 0x9ad0ec, 0xe76f51];
const SHOPHOUSE_COLORS = [0xf7b2bd, 0x9be3de, 0xffe29a, 0xb8e0a5, 0xc3aed6];

// HDB public housing block: white tower with a colored stripe and windows.
function hdbBlock(color: number): Box[] {
  const floors = 7;
  const boxes: Box[] = [
    [-7, 0, -4, 14, floors * 4 + 2, 8, C.white],
    [-7, 0, -4, 3, floors * 4 + 2, 8, color],
    [-7, floors * 4 + 2, -4, 14, 2, 8, color], // roof
  ];
  for (let f = 0; f < floors; f++) {
    for (const x of [-3, 0, 3]) {
      boxes.push([x, f * 4 + 2, -5, 2, 2, 1, C.window]);
    }
  }
  return boxes;
}

// Colorful Peranakan shophouse like in Joo Chiat or Chinatown.
function shophouse(color: number): Box[] {
  return [
    [-7, 0, -4, 14, 14, 8, color],
    [-7, 14, -4, 14, 3, 8, C.roofTile],
    [-7, 0, -5, 14, 1, 1, C.white],
    // door + windows with shutters
    [-1, 1, -5, 2, 5, 1, C.wood],
    [-5, 2, -5, 3, 3, 1, C.window],
    [2, 2, -5, 3, 3, 1, C.window],
    [-7, 7, -6, 14, 1, 2, C.white], // balcony
    [-5, 9, -5, 2, 3, 1, C.leaf],
    [-1, 9, -5, 2, 3, 1, C.leaf],
    [3, 9, -5, 2, 3, 1, C.leaf],
  ];
}

// Generic glass skyscraper of the CBD (Raffles Place), with a stepped top.
function cbdTower(glass: number, H: number): Box[] {
  const boxes: Box[] = [
    [-6, 0, -4, 12, H, 8, glass],
    [-4.5, H, -3, 9, 4, 6, glass],
    [-3, H + 4, -2, 6, 3, 4, glass],
    [-0.5, H + 7, -0.5, 1, 3, 1, 0x666666],
  ];
  boxes.push(...floorLines(-6, -4, 12, 8, 0, H, 3, 0xffffff));
  return boxes;
}

export const buildings = () =>
  [
    marinaBaySands(),
    esplanade(),
    singaporeFlyer(),
    pinnacleDuxton(),
    hdbBlock(HDB_COLORS[0]),
    hdbBlock(HDB_COLORS[1]),
    shophouse(SHOPHOUSE_COLORS[0]),
    shophouse(SHOPHOUSE_COLORS[2]),
    cbdTower(0x5d8fb5, 34),
  ].map((boxes) => voxelModel(boxes));

// ---------- River (replace the logs and lily pads) ----------

// Bumboat from the Singapore River, length in tiles (1-4).
function bumboat(tiles: number): Box[] {
  const L = tiles === 4 ? 62 : tiles * 16;
  const x0 = -L / 2;
  return [
    [x0 + 1, 0, -2, L - 2, 4, 6, C.boatHull],
    [x0, 2, -2, 1, 4, 6, C.boatHull], // raised stern
    [x0 + L - 1, 2, -2, 1, 4, 6, C.boatHull], // raised bow
    [x0 + 1, 4, -2, L - 2, 1, 1, C.boatTrim],
    [x0 + 1, 4, 3, L - 2, 1, 1, C.boatTrim],
    [x0 + 1, 3, -1, L - 2, 1, 4, C.boatDeck],
    // painted eyes on the bow, like real bumboats
    [x0 + L - 4, 2, -3, 2, 2, 1, C.white],
    [x0 + L - 3, 2, -3, 1, 1, 1, C.eye],
    [x0 + L - 4, 2, 4, 2, 2, 1, C.white],
    [x0 + L - 3, 2, 4, 1, 1, 1, C.eye],
  ];
}

export const boats = () =>
  [1, 2, 3, 4].map((t) =>
    voxelModel(bumboat(t), { castShadow: true, receiveShadow: true })
  );

// Little raft flying the Singapore flag (red over white, crescent and five
// stars), like on National Day. The flag faces the camera (-z).
function flagRaft(): Box[] {
  const red = 0xdf0f2b;
  return [
    [-4, 0, -4, 8, 0.8, 8, 0xa47148],
    [-4, 0.8, -1, 8, 0.1, 0.4, 0x7d5535], // planks
    [-4, 0.8, 2, 8, 0.1, 0.4, 0x7d5535],
    [3, 0.8, 2.6, 0.4, 9, 0.4, 0xdddddd], // pole
    [-3, 7.5, 2.7, 6, 2, 0.2, red],
    [-3, 5.5, 2.7, 6, 2, 0.2, 0xffffff],
    [1.2, 7.8, 2.6, 1, 1.4, 0.1, 0xffffff], // crescent
    [1.5, 8, 2.55, 0.8, 1.1, 0.1, red],
    [0.1, 8.7, 2.6, 0.3, 0.3, 0.1, 0xffffff], // stars
    [-0.5, 8.2, 2.6, 0.3, 0.3, 0.1, 0xffffff],
    [-0.3, 7.9, 2.6, 0.3, 0.3, 0.1, 0xffffff],
    [0.3, 7.9, 2.6, 0.3, 0.3, 0.1, 0xffffff],
    [0.5, 8.3, 2.6, 0.3, 0.3, 0.1, 0xffffff],
  ];
}

export const flagRafts = () => [
  voxelModel(flagRaft(), { castShadow: true, receiveShadow: true }),
];

// ---------- Vehicles ----------
// Vehicles are built along z with the front on +z; Road rotates them.

const WHEEL = 0x222222;
const GLASS_DARK = 0x2b3a4a;
const GRAB_GREEN = 0x00b14f;

function car(body: number, cabin: number): Box[] {
  return [
    [-8, 0, -6, 16, 3, 3, WHEEL],
    [-8, 0, 3, 16, 3, 3, WHEEL],
    [-7.5, 2, -8, 15, 5, 16, body],
    [-6.5, 7, -5, 13, 4, 9, GLASS_DARK],
    [-6.5, 11, -5, 13, 1, 9, cabin],
    [-6.6, 7, -1, 13.2, 4, 1, cabin], // middle pillar
    [-6, 4, 8, 3, 1.5, 0.3, 0xfff6c8], // headlights
    [3, 4, 8, 3, 1.5, 0.3, 0xfff6c8],
    [-6, 4, -8.3, 3, 1.5, 0.3, 0xd32f2f], // tail lights
    [3, 4, -8.3, 3, 1.5, 0.3, 0xd32f2f],
    [-7.5, 2, 8, 15, 1, 0.5, 0x444444], // bumpers
    [-7.5, 2, -8.5, 15, 1, 0.5, 0x444444],
  ];
}

// GrabCab: all-green Grab taxi with a roof sign.
function grabCab(): Box[] {
  return [
    ...car(GRAB_GREEN, GRAB_GREEN),
    [-7.7, 4, -5, 0.3, 1.5, 10, C.white], // "Grab" stripe on both sides
    [7.4, 4, -5, 0.3, 1.5, 10, C.white],
    [-3, 12, -1.5, 6, 2, 3, C.white],
    [-2.5, 12.5, -1.6, 5, 1, 3.2, GRAB_GREEN],
  ];
}

// GrabCar: private-hire car, silver with a green Grab decal.
function grabCar(): Box[] {
  return [
    ...car(0xc8ccd0, 0xc8ccd0),
    [-7.7, 3.5, -4, 0.3, 2, 8, GRAB_GREEN],
    [7.4, 3.5, -4, 0.3, 2, 8, GRAB_GREEN],
  ];
}

const BUS_GREEN = 0x4f9d2a; // LTA "Lush Green" livery
const BUS_LIME = 0xb5d334;

// Singapore double-decker bus in the Lush Green livery.
function doubleDecker(): Box[] {
  return [
    [-8, 0, -12, 16, 4, 4, WHEEL],
    [-8, 0, 7, 16, 4, 4, WHEEL],
    [-7.5, 2, -16, 15, 22, 32, BUS_GREEN],
    [-7.7, 3, -16, 15.4, 2, 32, BUS_LIME], // lime stripe at the bottom
    [-7.7, 8, -14, 15.4, 5, 29, GLASS_DARK], // lower deck windows
    [-7.7, 16, -15, 15.4, 5, 30, GLASS_DARK], // upper deck windows
    [-6, 7, 16, 12, 6, 0.3, GLASS_DARK], // windscreens
    [-6, 16, 16, 12, 5, 0.3, GLASS_DARK],
    [-5, 14, 16, 10, 1.5, 0.4, 0xff9800], // LED destination sign
    [-6.5, 4, 16, 2.5, 1.5, 0.4, 0xfff6c8],
    [4, 4, 16, 2.5, 1.5, 0.4, 0xfff6c8],
    [-7.5, 24, -15, 15, 0.5, 30, 0x3b7a1f], // roof
  ];
}

function singleDecker(): Box[] {
  return [
    [-8, 0, -11, 16, 4, 4, WHEEL],
    [-8, 0, 7, 16, 4, 4, WHEEL],
    [-7.5, 2, -15, 15, 13, 30, BUS_GREEN],
    [-7.7, 3, -15, 15.4, 2, 30, BUS_LIME],
    [-7.7, 8, -13, 15.4, 5, 27, GLASS_DARK],
    [-6, 6, 15, 12, 7, 0.3, GLASS_DARK],
    [-5, 13.5, 15, 10, 1.2, 0.4, 0xff9800],
    [-6.5, 4, 15, 2.5, 1.5, 0.4, 0xfff6c8],
    [4, 4, 15, 2.5, 1.5, 0.4, 0xfff6c8],
    [-6, 15, -12, 12, 1.5, 8, 0xdddddd], // air-con unit on the roof
  ];
}

// Taxis: blue Comfort and yellow CityCab, with their roof sign.
function taxi(body: number, sign: number): Box[] {
  return [
    ...car(body, body),
    [-2.5, 12, -1.5, 5, 1.8, 3, sign],
    [-2, 12.4, -1.6, 4, 1, 3.2, 0xffffff],
  ];
}

// Formula 1 car of the Singapore Grand Prix night race, in red and white.
function f1Car(): Box[] {
  const red = 0xd32f2f;
  return [
    [-1.8, 0.8, -8, 3.6, 2.2, 15, red], // nose and body
    [-4.5, 0.8, -5, 9, 2.4, 6, red], // sidepods
    [-6, 0.6, 6, 12, 0.6, 2, 0x111111], // front wing
    [-6, 4.5, -8, 12, 0.8, 2, red], // rear wing
    [-6, 5.3, -8, 12, 0.3, 2, 0xffffff],
    [-0.4, 3, -8, 0.8, 1.5, 1, 0x111111],
    [-7.5, 0, 3, 2.5, 3.5, 3.5, 0x111111], // wheels
    [5, 0, 3, 2.5, 3.5, 3.5, 0x111111],
    [-7.5, 0, -7, 2.5, 4, 4, 0x111111],
    [5, 0, -7, 2.5, 4, 4, 0x111111],
    [-1, 3, -3, 2, 1, 3, 0x111111], // halo
    [-0.8, 3.2, -2.5, 1.6, 1.4, 1.6, 0xffd400], // driver's helmet
    [-1.82, 1.5, -2, 3.64, 0.8, 8, 0xffffff], // white stripe
  ];
}

// Ice cream uncle: motorbike with a sidecar cart, a rainbow umbrella and
// "ice cream potong" slices.
function iceCreamUncle(): Box[] {
  return [
    [1, 0, -7, 1.2, 3, 3, 0x111111], // bike wheels
    [1, 0, 4, 1.2, 3, 3, 0x111111],
    [0.8, 2, -6, 1.6, 2, 11, 0x37474f], // bike
    [-6, 0, -2, 1.2, 2.5, 2.5, 0x111111], // cart wheel
    [-7, 2, -5, 7, 5, 9, 0xd32f2f], // cart
    [-7.05, 4, -5.05, 7.1, 1, 9.1, 0xffffff],
    [-5.5, 7, -3.5, 4, 0.4, 3, 0xf8bbd0], // ice cream slices
    [-5.5, 7, 0, 4, 0.4, 3, 0xfff59d],
    [-3.7, 7, -0.5, 0.4, 8, 0.4, 0x9e9e9e], // umbrella pole
    [-7.5, 15, -5, 3, 0.8, 10, 0xe53935], // umbrella
    [-4.5, 15, -5, 3, 0.8, 10, 0xffeb3b],
    [-1.5, 15, -5, 3, 0.8, 10, 0x1e88e5],
    [0.5, 4, -2, 2, 3, 2, 0x5d6d7e], // uncle
    [0.6, 7, -1.9, 1.8, 1.8, 1.8, 0xd9a066],
    [0.4, 8.6, -2.1, 2.2, 0.6, 2.4, 0xeeeeee], // cap
  ];
}

// Lorry carrying workers sitting in the back, a common sight on the roads.
function workerLorry(): Box[] {
  const boxes: Box[] = [
    [-8, 0, -11, 16, 3, 4, WHEEL],
    [-8, 0, 7, 16, 3, 4, WHEEL],
    [-7, 2, 6, 14, 9, 7, 0xf5f5f5], // cab
    [-6, 6, 12.8, 12, 3, 0.3, GLASS_DARK],
    [-7.1, 3, 6, 14.2, 1, 7, 0x1e63c8],
    [-7.5, 2, -13, 15, 2, 19, 0x6d6d6d], // flatbed
    [-7.5, 4, -13, 0.6, 3, 19, 0x2e6da4], // sides
    [6.9, 4, -13, 0.6, 3, 19, 0x2e6da4],
    [-7.5, 4, -13, 15, 3, 0.6, 0x2e6da4],
  ];
  for (const [x, z] of [[-4, -10], [3, -10], [-4, -3], [3, -3]]) {
    boxes.push([x, 4, z, 2, 3, 2, 0xff8f00]); // hi-vis vests
    boxes.push([x + 0.2, 7, z + 0.2, 1.6, 1.6, 1.6, 0x8d5524]);
    boxes.push([x, 8.6, z, 2, 0.6, 2, 0xffd400]); // helmets
  }
  return boxes;
}

export const vehicles = {
  police_car: () => taxi(0xffd400, 0x1565c0), // CityCab
  blue_car: () => taxi(0x1e6fd9, 0x0d47a1), // Comfort
  green_car: f1Car,
  orange_car: iceCreamUncle,
  purple_car: grabCar,
  taxi: grabCab,
  grab_car: singleDecker,
  blue_truck: doubleDecker,
  red_truck: workerLorry,
};

// ---------- Marina Bay promenade (replaces the grass) ----------
// Big grey granite slabs; on some rows timber decking takes over on one side,
// like along the waterfront. The row is 25 tiles wide, top at y = 6.

export const PROMENADE_COLORS = {
  base: 0xbdb8ae,
  granite: [0xd5d2cb, 0xc9c5bd, 0xdcd9d2],
  timber: [0xa47148, 0x8f5f3a],
};

export function promenadeBoxes(variant: number, colors = PROMENADE_COLORS): Box[] {
  const { granite: GRANITE, timber: TIMBER } = colors;
  const H = 6;
  const HALF = 200;
  const boxes: Box[] = [[-HALF, 0, -8, HALF * 2, H - 0.1, 16, colors.base]];
  const slab = 32; // a slab is 2 tiles long
  const deck = variant === 1;
  const graniteDepth = deck ? 9 : 16;
  const shift = variant === 0 ? 0 : 16; // stagger the joints between rows

  for (let x = -HALF - shift, i = 0; x < HALF; x += slab, i++) {
    const x0 = Math.max(x, -HALF);
    const w = Math.min(x + slab, HALF) - x0;
    boxes.push([x0 + 0.15, H - 0.2, -8 + 0.15, w - 0.3, 0.2, graniteDepth - 0.3, GRANITE[i % 3]]);
  }
  if (deck) {
    // timber boardwalk planks
    for (let x = -HALF, i = 0; x < HALF; x += 2, i++) {
      boxes.push([x + 0.1, H - 0.2, 1.1, 1.8, 0.2, 6.8, TIMBER[i % 2]]);
    }
    boxes.push([-HALF, H - 0.25, 0.8, HALF * 2, 0.25, 0.3, 0x7a7a7a]); // steel edge
  }
  return boxes;
}

export const promenade = (variant: number) =>
  voxelModel(promenadeBoxes(variant), { castShadow: false, receiveShadow: true });

// ---------- MRT (replaces the railroad, train and crossing lights) ----------
// Track with sleepers and a third rail, and an MRT train in the white livery
// with the red and green band of the North South and East West lines.

const MRT_BASE = 1.6; // the track is a bit higher than the train's ground level

export function mrtTrack() {
  const H = 8;
  const W = 200;
  const boxes: Box[] = [
    [-W, 0, -8, W * 2, H, 16, 0xb8b8b0],
    [-W, H, -6, W * 2, 0.1, 12, 0x8a8580], // ballast
    [-W, H + 0.3, -4.5, W * 2, 0.6, 0.6, 0x9ea4a8], // rails
    [-W, H + 0.3, 3.5, W * 2, 0.6, 0.6, 0x9ea4a8],
    [-W, H, 5.6, W * 2, 0.8, 0.8, 0xffd400], // third rail cover
  ];
  for (let x = -W; x < W; x += 4) {
    boxes.push([x, H, -5.5, 1.5, 0.3, 10, 0x707070]); // concrete sleepers
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// One MRT car centred on x = 0; `cab` adds a driver's cab at that end.
function mrtCar(cab: "none" | "front" | "back"): Box[] {
  const y = MRT_BASE;
  const L = 70;
  const x0 = -L / 2;
  const boxes: Box[] = [
    [x0, y + 1, -5.5, L, 13, 11, 0xf4f4f4],
    [x0, y + 14, -5, L, 1, 10, 0xcfd3d6], // roof
    [x0, y + 5, -5.6, L, 1.2, 11.2, 0xd32f2f], // red band
    [x0, y + 3.8, -5.6, L, 1.2, 11.2, 0x2e7d32], // green band
    [x0 + 2, y + 7, -5.6, L - 4, 4, 11.2, 0x1c2833], // windows
    [x0 + 6, y - 0.8, -4, 8, 1.8, 8, 0x222222], // bogies
    [x0 + L - 14, y - 0.8, -4, 8, 1.8, 8, 0x222222],
  ];
  for (let x = x0 + 6; x < x0 + L - 4; x += 12) {
    boxes.push([x, y + 7, -5.65, 1, 4, 11.3, 0xf4f4f4]); // window pillars
  }
  for (let x = x0 + 9; x < x0 + L - 6; x += 18) {
    boxes.push([x, y + 1.5, -5.7, 4, 10, 0.2, 0xdfe3e6]); // doors (both sides)
    boxes.push([x, y + 1.5, 5.5, 4, 10, 0.2, 0xdfe3e6]);
  }
  const nose = (x: number, dir: number): Box[] => [
    [x, y + 1, -5, 2.5 * dir, 11, 10, 0xf4f4f4],
    [x + 2.5 * dir - (dir > 0 ? 0.3 : 0), y + 6, -4, 0.3, 5, 8, 0x1c2833], // windscreen
    [x + 2.5 * dir - (dir > 0 ? 0.3 : 0), y + 2.5, -4, 0.35, 1, 1.5, 0xfff6c8],
    [x + 2.5 * dir - (dir > 0 ? 0.3 : 0), y + 2.5, 2.5, 0.35, 1, 1.5, 0xfff6c8],
  ];
  if (cab === "back") boxes.push(...nose(x0 + L, 1).map(fixNegative));
  if (cab === "front") boxes.push(...nose(x0, -1).map(fixNegative));
  return boxes;
}

// Boxes built with a negative width are turned into normal ones.
const fixNegative = ([x, y, z, w, h, d, c]: Box): Box =>
  w < 0 ? [x + w, y, z, -w, h, d, c] : [x, y, z, w, h, d, c];

// The train is laid out along +x and moves towards +x: "front" is the tail
// car and "back" leads, so each end gets a driver's cab.
export const mrtPieces = () => ({
  front: voxelModel(mrtCar("front")),
  middle: voxelModel(mrtCar("none")),
  back: voxelModel(mrtCar("back")),
});

// Red MRT sign on a post, with two lamps that flash when a train comes.
// Faces +z here: the row turns it towards the camera.
function mrtSign(left: boolean, right: boolean): Box[] {
  const off = 0x5a5a5a;
  const on = 0xff1744;
  const text = wallText("MRT", 0, 18.5, 1.15, 0xffffff, 0.6, 0.15).map(
    ([x, y, z, w, h, d, c]): Box => [-(x + w), y, z, w, h, d, c] // read from +z
  );
  return [
    [-0.5, 0, -0.5, 1, 23, 1, 0x9e9e9e],
    [-4, 16, 0.4, 8, 5, 0.6, 0xd32f2f],
    ...text,
    [-2.5, 23, -1, 2, 1.5, 2, left ? on : off],
    [0.5, 23, -1, 2, 1.5, 2, right ? on : off],
    [-3, 22.5, -1, 6, 0.5, 2, 0x333333],
  ];
}

export const mrtSigns = () => ({
  inactive: voxelModel(mrtSign(false, false)),
  active_0: voxelModel(mrtSign(true, false)),
  active_1: voxelModel(mrtSign(false, true)),
});
