import { Box, voxelModel } from "./Voxel";

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
  bougainvillea: 0xe0218a,
  stone: 0x9e9e9e,
  merlion: 0xf2efe6,
  merlionMane: 0xe0d6bf,
  eye: 0x222222,
  water: 0x6ec6ff,
  durian: 0x9aa832,
  durianSpike: 0x6f7d1f,
  lanternRed: 0xd7261e,
  gold: 0xf2c230,
  window: 0x2d4a6b,
  white: 0xffffff,
  roofTile: 0xb5482b,
  boatHull: 0x8b2e1a,
  boatTrim: 0xf2c230,
  boatDeck: 0xc08a55,
  lotusPad: 0x4caf50,
  lotusFlower: 0xf48fb1,
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

function bougainvilleaBush(): Box[] {
  return [
    [-4, 0, -3, 8, 6, 6, C.leaf],
    [-3, 6, -2, 6, 2, 4, C.leafLight],
    [-4, 4, -3, 2, 2, 1, C.bougainvillea],
    [1, 2, -3, 2, 2, 1, C.bougainvillea],
    [-1, 7, -2, 2, 1, 2, C.bougainvillea],
    [3, 3, 0, 1, 2, 2, C.bougainvillea],
    [-4, 1, 1, 1, 2, 2, C.bougainvillea],
  ];
}

export const trees = () => [
  voxelModel(supertree(30)),
  voxelModel(palmTree()),
  voxelModel(rainTree()),
  voxelModel(bougainvilleaBush()),
];

// ---------- Small obstacles (replace the boulders) ----------

function merlion(): Box[] {
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

export const obstacles = () => [
  voxelModel(merlion()),
  voxelModel(durian()),
  voxelModel(lantern()),
];

// ---------- Buildings (line the edges of the map) ----------

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

export const buildings = () => [
  ...HDB_COLORS.map((c) => voxelModel(hdbBlock(c))),
  ...SHOPHOUSE_COLORS.map((c) => voxelModel(shophouse(c))),
];

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

export const lotus = () =>
  voxelModel(
    [
      [-4, 0, -4, 8, 1, 8, C.lotusPad],
      [-1, 1, -1, 2, 2, 2, C.lotusFlower],
      [-2, 1, 0, 1, 1, 1, C.lotusFlower],
      [1, 1, -1, 1, 1, 1, C.lotusFlower],
      [0, 3, 0, 1, 1, 1, C.gold],
    ],
    { castShadow: true, receiveShadow: true }
  );
