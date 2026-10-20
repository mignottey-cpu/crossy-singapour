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
  white: 0xffffff,
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

// UOB Plaza One: octagonal granite tower with rotated cubes stacked on top.
function uobPlaza(): Box[] {
  const H = 38;
  const granite = 0x9b9a9f;
  const boxes: Box[] = [
    // octagon = two overlapping boxes
    [-5, 0, -3, 10, H, 6, granite],
    [-3, 0, -5, 6, H, 10, granite],
    // crown: smaller octagons stepping up
    [-4, H, -2, 8, 4, 4, 0xb5b4b9],
    [-2, H, -4, 4, 4, 8, 0xb5b4b9],
    [-2, H + 4, -2, 4, 3, 4, granite],
    [-0.5, H + 7, -0.5, 1, 4, 1, 0x666666], // mast
  ];
  boxes.push(...floorLines(-5, -3, 10, 6, 0, H, 3, 0x5f6b77));
  boxes.push(...floorLines(-3, -5, 6, 10, 0, H, 3, 0x5f6b77));
  return boxes;
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
    pinnacleDuxton(),
    uobPlaza(),
    cbdTower(0x5d8fb5, 34),
    cbdTower(0x7fa7a0, 28),
    cbdTower(0x9fb8d6, 40),
  ].map((boxes) => voxelModel(boxes));

// ---------- River (replace the logs and lily pads) ----------

// Malayan water monitor, the big lizard swimming in Singapore's rivers.
// Length in tiles (1-4), head on +x. Dark grey-brown with yellow spots.
function waterMonitor(tiles: number): Box[] {
  const L = tiles === 4 ? 62 : tiles * 16;
  const x0 = -L / 2;
  const dark = 0x3d3a2f;
  const belly = 0x6b6650;
  const spot = 0xd9c24a;
  const tail = Math.round(L * 0.4);
  const head = Math.max(5, Math.round(L * 0.15));
  const body = L - tail - head;
  const bodyX = x0 + tail;
  const headX = bodyX + body;

  const boxes: Box[] = [
    // tail, tapering towards the tip
    [x0, 1, -1, tail / 2, 2, 2, dark],
    [x0 + tail / 2, 1, -1.5, tail / 2, 3, 3, dark],
    // body
    [bodyX, 0, -3, body, 5, 6, dark],
    [bodyX, 0, -3.1, body, 1.5, 6.2, belly],
    // neck + head
    [headX, 1, -2, head * 0.4, 4, 4, dark],
    [headX + head * 0.4, 1.5, -1.5, head * 0.6, 3, 3, dark],
    // eyes and forked tongue
    [headX + head * 0.5, 3.5, -1.7, 1, 0.8, 0.3, spot],
    [headX + head * 0.5 + 0.3, 3.6, -1.8, 0.4, 0.5, 0.3, 0x111111],
    [headX + head * 0.5, 3.5, 1.4, 1, 0.8, 0.3, spot],
    [headX + head * 0.5 + 0.3, 3.6, 1.5, 0.4, 0.5, 0.3, 0x111111],
    [x0 + L - 1, 2, -0.6, 1, 0.3, 0.4, 0xc0507f],
    [x0 + L - 1, 2, 0.2, 1, 0.3, 0.4, 0xc0507f],
    // legs, splayed out to the sides
    [bodyX + 1, 0, -5, 2, 1.5, 2, dark],
    [bodyX + 1, 0, 3, 2, 1.5, 2, dark],
    [bodyX + body - 3, 0, -5, 2, 1.5, 2, dark],
    [bodyX + body - 3, 0, 3, 2, 1.5, 2, dark],
  ];
  // rows of yellow spots on the back and bands on the tail
  for (let x = bodyX + 1; x < bodyX + body - 1; x += 3) {
    boxes.push([x, 5, -2, 1, 0.3, 1, spot]);
    boxes.push([x + 1.5, 5, 1, 1, 0.3, 1, spot]);
  }
  for (let x = x0 + 2; x < bodyX - 1; x += 4) {
    boxes.push([x, x < x0 + tail / 2 ? 3 : 4, -1, 1, 0.3, 2, spot]);
  }
  return boxes;
}

export const lizards = () =>
  [1, 2, 3, 4].map((t) =>
    voxelModel(waterMonitor(t), { castShadow: true, receiveShadow: true })
  );

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

export const vehicles = {
  taxi: grabCab,
  grab_car: grabCar,
  blue_truck: doubleDecker,
  red_truck: singleDecker,
};

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
