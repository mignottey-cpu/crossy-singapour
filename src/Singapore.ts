import { Box, voxelModel } from "./Voxel";

// Voxel decor inspired by Singapore. Units are 1/16 of a tile (see Voxel.ts).
// The camera looks from -z, so "front" details are placed on the -z side.

const C = {
  supertreeTrunk: 0x5b2c6f,
  supertreeTrunkLight: 0x7d3c98,
  supertreeCanopy: 0xc0398f,
  supertreeRim: 0xff79c6,
  leaf: 0x3e8e41,
  leafLight: 0x6abf4b,
  stone: 0x9e9e9e,
  merlion: 0xf2efe6,
  merlionMane: 0xe0d6bf,
  eye: 0x222222,
  water: 0x6ec6ff,
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

// Pint of Tiger, the lager brewed in Singapore since 1932:
// golden beer, thick white head running down the glass, blue and orange label.
function beerGlass(): Box[] {
  const glass = 0xd6eef5;
  const boxes: Box[] = [
    [-3, 0, -3, 6, 1, 6, glass], // thick glass base
    [-3, 1, -3, 6, 4, 6, 0xe89c00],
    [-3.5, 5, -3.5, 7, 4, 7, 0xf2ad10],
    [-4, 9, -4, 8, 3, 8, 0xf7bf2e],
    // label
    [-3.6, 6, -3.6, 7.2, 2, 7.2, 0x1b2a5c],
    [-3.65, 6.7, -3.65, 7.3, 0.6, 7.3, 0xf28c00],
    // foam head overflowing
    [-4.2, 12, -4.2, 8.4, 2, 8.4, 0xfffdf5],
    [-3, 14, -2, 3, 1, 3, 0xfffdf5],
    [0, 14, -1, 3, 1.5, 3, 0xfffdf5],
    [-4.4, 10, 1, 0.4, 2.5, 1.2, 0xfffdf5],
    [3.9, 10.5, -4.4, 1.2, 2, 0.4, 0xfffdf5],
    // handle
    [4, 4, -0.75, 2, 1, 1.5, glass],
    [5, 4, -0.75, 1, 6, 1.5, glass],
    [4, 9, -0.75, 2, 1, 1.5, glass],
  ];
  // bubbles rising
  for (const [x, y, z] of [[-3.1, 3, -1], [-3.6, 7, 1], [-4.1, 10, -2], [-3.1, 2, 2]]) {
    boxes.push([x, y, z, 0.2, 0.5, 0.5, 0xffe9a8]);
  }
  return boxes;
}

// ---------- Desks lit by a lamp (replace the palm and rain trees) ----------

// Anglepoise-style lamp: weighted base, two-part arm balanced by springs,
// conical shade lighting a pool on the desk. Desk top is at y = 8.
function deskWithLamp(desk: number, lamp: number, items: Box[]): Box[] {
  const top = 8;
  return [
    // desk
    [-6, top - 1, -4, 12, 1, 8, desk],
    [-6, 0, -4, 1, top - 1, 1, desk],
    [5, 0, -4, 1, top - 1, 1, desk],
    [-6, 0, 3, 1, top - 1, 1, desk],
    [5, 0, 3, 1, top - 1, 1, desk],
    [-6, top - 3, 3, 12, 2, 1, desk], // back panel
    // pool of warm light on the desk
    [-4.5, top, -2.5, 6, 0.05, 5, 0xfff1a8],
    // lamp
    [2, top, 1, 3, 0.6, 3, lamp], // base
    [3.2, top + 0.6, 2.2, 0.6, 5.5, 0.6, lamp], // lower arm
    [3.9, top + 1.5, 2.2, 0.2, 3.5, 0.4, 0xb0b4b8], // spring
    [-1.5, top + 6, 2.2, 5.3, 0.6, 0.6, lamp], // upper arm
    [-1, top + 6.6, 2.3, 4, 0.2, 0.4, 0xb0b4b8], // spring
    [-3, top + 3.6, 1.2, 3, 2.4, 2.6, lamp], // conical shade
    [-3.5, top + 3.2, 0.7, 4, 0.6, 3.6, lamp], // flared rim
    [-2.7, top + 3, 1.3, 2.4, 0.3, 2.4, 0xfff3b0], // glowing bulb
    ...items,
  ];
}

const deskItems = {
  notebook: [
    [-4, 8, -2, 3, 0.4, 4, 0xfafafa],
    [-4, 8.4, -2, 3, 0.1, 4, 0x1e88e5],
    [-0.5, 8, -1, 0.3, 0.3, 3, 0xf7c42b], // pencil
  ] as Box[],
  mugAndLaptop: [
    [-4.5, 8, -2.5, 5, 0.5, 3.5, 0xc8ccd0], // closed laptop
    [-3.5, 8, 1.5, 1.5, 2, 1.5, 0xffffff], // coffee mug
    [-2, 8.6, 1.9, 0.5, 1, 0.6, 0xffffff],
    [-3.3, 9.8, 1.7, 1.1, 0.1, 1.1, 0x5d3a1a],
  ] as Box[],
};

export const desks = () => [
  deskWithLamp(0xa0703c, 0x212121, deskItems.notebook),
  deskWithLamp(0xf2f2f2, 0xd32f2f, deskItems.mugAndLaptop),
];

export const trees = () => [
  voxelModel(supertree(30)),
  voxelModel(beerGlass()),
  ...desks().map((boxes) => voxelModel(boxes)),
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

// Professor in a tweed jacket pointing at a chalkboard with a stick.
// Faces -z (the camera).
export function professor(): Box[] {
  const jacket = 0x7a5c3e;
  const skin = 0xf0c8a0;
  const grey = 0xbdbdbd;
  const chalk = 0xf0f0f0;
  const wood = 0x8b5a2b;
  const boxes: Box[] = [
    // chalkboard on an easel
    [-4.8, 0, 0.8, 0.6, 4.5, 0.6, wood],
    [0.6, 0, 0.8, 0.6, 4.5, 0.6, wood],
    [-2.3, 0, 2.5, 0.6, 9, 0.6, wood],
    [-5.3, 4.2, 0.6, 7.1, 8.6, 0.8, wood],
    [-5, 4.5, 0.4, 6.5, 8, 0.5, 0x2f4f3a],
    [-5, 4.1, 0, 6.5, 0.4, 0.8, wood], // chalk tray
    [-1, 4.5, 0.05, 1, 0.3, 0.3, chalk],
    // chalk writing: a formula and a little graph
    [-4.5, 11, 0.3, 2.5, 0.4, 0.1, chalk],
    [-1.5, 11, 0.3, 0.6, 0.4, 0.1, chalk],
    [-0.5, 11, 0.3, 1.2, 0.4, 0.1, chalk],
    [-4.5, 9.8, 0.3, 4, 0.4, 0.1, chalk],
    [-4.3, 5.5, 0.3, 0.3, 3.3, 0.1, chalk], // graph axes
    [-4.3, 5.5, 0.3, 4.3, 0.3, 0.1, chalk],
    [-3.6, 5.9, 0.3, 0.8, 0.3, 0.1, 0xf7d046], // rising curve
    [-2.8, 6.5, 0.3, 0.8, 0.3, 0.1, 0xf7d046],
    [-2, 7.3, 0.3, 0.8, 0.3, 0.1, 0xf7d046],
    [-1.2, 8.3, 0.3, 0.8, 0.3, 0.1, 0xf7d046],
    // professor
    [2, 0, -3.5, 1.5, 0.8, 2.2, 0x1a1a1a],
    [3.8, 0, -3.5, 1.5, 0.8, 2.2, 0x1a1a1a],
    [2, 0.8, -3, 1.5, 3.5, 1.5, 0x3a3a44],
    [3.8, 0.8, -3, 1.5, 3.5, 1.5, 0x3a3a44],
    [1.8, 4.3, -3.3, 3.7, 4.5, 2, jacket],
    [3.1, 6.8, -3.35, 1.1, 2, 0.1, 0xffffff], // shirt
    [3.45, 5.8, -3.4, 0.4, 2.5, 0.1, 0xb71c1c], // tie
    [2, 6, -3.35, 0.4, 0.8, 0.1, 0x5c4430], // elbow-patch style pocket
    // left arm raised, holding the pointer towards the board
    [0.9, 7, -3, 0.9, 2.5, 1.4, jacket],
    [0.9, 9.5, -3, 0.9, 0.8, 1.2, skin],
    [-3, 9.9, -2.6, 4, 0.3, 0.3, 0xd2a86e],
    // right arm down, holding a book
    [5.5, 4.8, -3, 0.9, 3.8, 1.4, jacket],
    [5.5, 4.2, -3, 0.9, 0.7, 1.2, skin],
    [5.3, 4.2, -3.8, 1.3, 1.8, 0.6, 0x1565c0],
    // head, glasses, grey beard and hair
    [2.1, 8.8, -3.6, 3.2, 3.2, 2.8, skin],
    [2.3, 10.1, -3.7, 1.3, 0.9, 0.1, 0x222222],
    [3.8, 10.1, -3.7, 1.3, 0.9, 0.1, 0x222222],
    [2.45, 10.25, -3.75, 1, 0.6, 0.1, 0xcfe8f0],
    [3.95, 10.25, -3.75, 1, 0.6, 0.1, 0xcfe8f0],
    [2.2, 8.8, -3.75, 3, 1.1, 0.4, grey], // beard
    [3, 9.6, -3.8, 1.4, 0.4, 0.3, grey], // moustache
    [1.9, 10.4, -3.4, 0.3, 1.6, 2.8, grey],
    [5.2, 10.4, -3.4, 0.3, 1.6, 2.8, grey],
    [2.1, 11, -0.9, 3.2, 1.6, 0.4, grey],
    [2.4, 12, -3.3, 2.6, 0.4, 2.2, grey],
  ];
  return boxes;
}

// Exam papers: a header box for name / candidate number, a red margin,
// lines of handwriting and the grade circled in red pen.
const PAPER = 0xfbfaf5;
const PAPER_SHADE = 0xe9e6dc;
const INK = 0x4f6fae;
const RED_PEN = 0xd62828;

// The game camera looks from -z, so pages are mirrored on x to read correctly.
export const mirrorX = (boxes: Box[]): Box[] =>
  boxes.map(([x, y, z, w, h, d, c]) => [-(x + w), y, z, w, h, d, c]);

// Details drawn on the top sheet of a pile whose top is at height y.
function examSheetTop(y: number): Box[] {
  const boxes: Box[] = [
    [-3.5, y, 3, 7, 0.1, 2, PAPER_SHADE], // header box
    [-3, y + 0.1, 4.2, 3.5, 0.05, 0.3, 0x555555], // name
    [-3, y + 0.1, 3.4, 2, 0.05, 0.3, 0x555555], // candidate number
    [-2.9, y, -5, 0.2, 0.1, 7.6, RED_PEN], // margin
    // grade circled in red, top right corner
    [1.8, y + 0.1, 3.1, 1.8, 0.1, 0.3, RED_PEN],
    [1.8, y + 0.1, 4.5, 1.8, 0.1, 0.3, RED_PEN],
    [1.6, y + 0.1, 3.3, 0.3, 0.1, 1.3, RED_PEN],
    [3.5, y + 0.1, 3.3, 0.3, 0.1, 1.3, RED_PEN],
    [2.3, y + 0.15, 3.6, 0.8, 0.1, 0.6, RED_PEN],
  ];
  // handwritten answer lines of different lengths
  const lengths = [5.5, 6, 4, 5.8, 3, 6, 5, 2.5];
  lengths.forEach((len, i) => {
    boxes.push([-2.4, y, 2 - i, len, 0.08, 0.3, INK]);
  });
  // red ticks in the margin
  boxes.push([-3.8, y + 0.1, 1.5, 0.6, 0.1, 0.3, RED_PEN]);
  boxes.push([-3.8, y + 0.1, -1.5, 0.6, 0.1, 0.3, RED_PEN]);
  return boxes;
}

// A pile of exam copies with a pencil lying on top.
export function examPaper(): Box[] {
  const boxes: Box[] = [];
  for (let i = 0; i < 4; i++) {
    const o = i % 2 ? 0.3 : -0.3; // slightly messy pile
    boxes.push([-4 + o, i * 0.5, -5.5 - o, 8, 0.5, 11, i % 2 ? PAPER_SHADE : PAPER]);
  }
  const top = 2;
  boxes.push(...examSheetTop(top));
  boxes.push(
    [3.2, top, -4, 0.8, 0.8, 5.5, 0xf7c42b], // pencil
    [3.2, top, 1.5, 0.8, 0.8, 1, 0xe8c28e],
    [3.4, top + 0.2, 2.5, 0.4, 0.4, 0.5, 0x333333],
    [3.2, top, -4.6, 0.8, 0.8, 0.6, 0xc0c0c0],
    [3.2, top, -5.5, 0.8, 0.8, 0.9, 0xf48fb1] // eraser
  );
  return boxes;
}

// A tall stack of exams to mark, held by a black binder clip.
export function examStack(): Box[] {
  const boxes: Box[] = [];
  for (let i = 0; i < 12; i++) {
    const o = [0, 0.4, -0.3, 0.2][i % 4];
    boxes.push([-4 + o, i * 0.6, -5.5 + o / 2, 8, 0.6, 11, i % 3 ? PAPER : PAPER_SHADE]);
  }
  const top = 7.2;
  boxes.push(...examSheetTop(top));
  boxes.push(
    [-1.5, top - 1.5, 5.4, 3, 1.8, 0.6, 0x1a1a1a], // binder clip
    [-1.2, top + 0.3, 4.4, 0.3, 0.8, 1.5, 0xb0b4b8],
    [0.9, top + 0.3, 4.4, 0.3, 0.8, 1.5, 0xb0b4b8]
  );
  return boxes;
}

export const obstacles = () => [
  voxelModel(merlion()),
  voxelModel(professor()),
  voxelModel(mirrorX(examPaper())),
  voxelModel(mirrorX(examStack())),
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

// Wads of Singapore dollar notes (Portrait series, first president
// Yusof bin Ishak on the front) floating down the river, held by a bank band.
// A platform 1 to 4 tiles long is a row of wads.
const NOTES = [
  { base: 0x7e57c2, light: 0xb39ddb }, // $2 purple
  { base: 0x388e3c, light: 0x81c784 }, // $5 green
  { base: 0xd32f2f, light: 0xef9a9a }, // $10 red
  { base: 0x1565c0, light: 0x64b5f6 }, // $50 blue
  { base: 0xef6c00, light: 0xffb74d }, // $100 orange
];

function wad(cx: number, note: { base: number; light: number }): Box[] {
  const L = 15;
  const D = 8;
  const x0 = cx - L / 2;
  const boxes: Box[] = [];
  // a few notes stacked a bit messily
  for (let i = 0; i < 3; i++) {
    const o = [0, 0.4, -0.3][i];
    boxes.push([x0 + o, 2 + i, -D / 2 - o / 2, L, 1, D, i % 2 ? note.light : note.base]);
  }
  const y = 5;
  boxes.push(
    [x0 + 0.5, y, -D / 2 + 0.5, L - 1, 0.1, D - 1, note.light], // inner frame
    [x0 + 1, y + 0.05, -D / 2 + 1, L - 2, 0.1, D - 2, note.base],
    // portrait of Yusof bin Ishak in an oval frame
    [x0 + 1.5, y + 0.1, -2.2, 4, 0.1, 4.4, 0xe8dcc0],
    [x0 + 2.2, y + 0.15, -1.4, 2.6, 0.1, 2.8, 0x8d6e63],
    [x0 + 2.5, y + 0.2, 0.4, 2, 0.1, 1, 0x4e342e], // songkok
    // silver holographic strip and the value in the corner
    [x0 + 6.5, y + 0.1, -D / 2 + 0.5, 0.8, 0.1, D - 1, 0xcfd8dc],
    [x0 + L - 4, y + 0.1, 1.5, 2.6, 0.1, 1.6, 0xffffff],
    [x0 + L - 4, y + 0.1, -3, 1.6, 0.1, 1, 0xffffff],
    [x0 + 9, y + 0.1, -0.8, 1.6, 0.1, 1.6, 0xf2c230], // coat of arms
    // bank band around the wad
    [cx + 2.5, 1.9, -D / 2 - 0.1, 2.5, y - 1.7, D + 0.2, 0xf5ecd7],
    [cx + 2.5, y + 0.2, -D / 2 - 0.1, 2.5, 0.2, D + 0.2, 0xf5ecd7],
    [cx + 3.4, y + 0.4, -D / 2 - 0.1, 0.7, 0.1, D + 0.2, 0xb71c1c],
  );
  return boxes;
}

function notes(tiles: number): Box[] {
  const L = tiles === 4 ? 62 : tiles * 16;
  const step = L / tiles;
  const boxes: Box[] = [];
  for (let i = 0; i < tiles; i++) {
    const note = NOTES[(i * 2 + tiles) % NOTES.length];
    boxes.push(...wad(-L / 2 + step * (i + 0.5), note));
  }
  return boxes;
}

export const banknotes = () =>
  [1, 2, 3, 4].map((t) =>
    voxelModel(notes(t), { castShadow: true, receiveShadow: true })
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

// ---------- Supercars (replace the regular cars) ----------
// Low, wide and long (front on +z), like Crossy Road cars but sportier.

const RIM = 0xb0b4b8;
const INTAKE = 0x151515;

function supercarBase(): Box[] {
  return [
    // wheels with silver rims
    [-8, 0, -8, 16, 3, 4, WHEEL],
    [-8, 0, 4, 16, 3, 4, WHEEL],
    [-8.1, 0.8, -7, 0.2, 1.4, 2, RIM],
    [7.9, 0.8, -7, 0.2, 1.4, 2, RIM],
    [-8.1, 0.8, 5, 0.2, 1.4, 2, RIM],
    [7.9, 0.8, 5, 0.2, 1.4, 2, RIM],
    // diffuser
    [-6, 1, -10.3, 12, 1, 0.4, INTAKE],
  ];
}

// Ferrari-style: sculpted body in Rosso Corsa, rounded cabin, quad tail lights.
function ferrari(): Box[] {
  const red = 0xd40000;
  return [
    ...supercarBase(),
    [-7.5, 1.5, -10, 15, 3.5, 20, red],
    [-7, 5, 3, 14, 0.8, 7, red], // long sloping hood
    [-6.5, 5, -4, 13, 3, 7, GLASS_DARK],
    [-5.5, 8, -3, 11, 0.7, 5, red], // roof
    [-7, 5, -10, 14, 1.5, 6, red], // engine cover
    [-7.6, 2.5, -5, 0.3, 2, 3, INTAKE], // side intakes
    [7.3, 2.5, -5, 0.3, 2, 3, INTAKE],
    [-1.5, 1.5, 10, 3, 1.5, 0.3, INTAKE], // grille
    [-6.5, 4, 10, 3, 1, 0.3, 0xfff6c8], // slim LED headlights
    [3.5, 4, 10, 3, 1, 0.3, 0xfff6c8],
    [-6, 4, -10.3, 1.5, 1.5, 0.3, 0xff3030], // round quad tail lights
    [-3.5, 4, -10.3, 1.5, 1.5, 0.3, 0xff3030],
    [2, 4, -10.3, 1.5, 1.5, 0.3, 0xff3030],
    [4.5, 4, -10.3, 1.5, 1.5, 0.3, 0xff3030],
    [-0.5, 5.8, 9, 1, 0.3, 1, 0xffd400], // yellow badge on the hood
  ];
}

// Lamborghini-style: sharp wedge, big rectangular side intakes, rear wing.
function lamborghini(color: number): Box[] {
  return [
    ...supercarBase(),
    [-7.5, 1.5, -10, 15, 2.5, 20, color],
    [-7.5, 4, -10, 15, 1, 15, color], // wedge rises towards the back
    [-7.5, 5, -10, 15, 1, 8, color],
    [-6, 5, -3, 12, 2, 6, GLASS_DARK], // angular cabin
    [-5, 7, -6, 10, 1.2, 6, GLASS_DARK],
    [-5, 8.2, -6, 10, 0.5, 5, color],
    [-7.7, 2.5, -8, 0.3, 3, 4, INTAKE], // huge side intakes
    [7.4, 2.5, -8, 0.3, 3, 4, INTAKE],
    [-7, 1.5, 10, 4, 1.5, 0.3, INTAKE], // front air curtains
    [3, 1.5, 10, 4, 1.5, 0.3, INTAKE],
    [-6.5, 3.2, 10, 3.5, 0.8, 0.3, 0xffffff], // Y-shaped lights
    [3, 3.2, 10, 3.5, 0.8, 0.3, 0xffffff],
    [-6.5, 4, -10.3, 4, 0.8, 0.3, 0xff3030],
    [2.5, 4, -10.3, 4, 0.8, 0.3, 0xff3030],
    [-6.5, 2.5, -10.3, 1, 1.5, 0.3, 0xff3030],
    [5.5, 2.5, -10.3, 1, 1.5, 0.3, 0xff3030],
    [-2, 7.5, -10, 0.6, 1.5, 1, INTAKE], // rear wing
    [1.4, 7.5, -10, 0.6, 1.5, 1, INTAKE],
    [-7, 9, -10.5, 14, 0.6, 2.5, INTAKE],
  ];
}

// Porsche 911-style: rounded silver coupe, round headlights, ducktail.
function porsche911(): Box[] {
  const silver = 0xd9dde0;
  return [
    ...supercarBase(),
    [-7.5, 1.5, -10, 15, 3.5, 20, silver],
    [-6.5, 5, 3, 13, 0.8, 6, silver],
    [-6, 5, -5, 12, 3.5, 8, GLASS_DARK],
    [-5.5, 8.5, -4.5, 11, 0.7, 6, silver], // long sloping roof
    [-6.5, 5, -10, 13, 1.5, 5, silver],
    [-7, 6.5, -10.5, 14, 0.6, 2, silver], // ducktail spoiler
    [-6.5, 3.5, 10, 2.5, 2.5, 0.3, 0xfff6c8], // round-ish headlights
    [4, 3.5, 10, 2.5, 2.5, 0.3, 0xfff6c8],
    [-7, 4, -10.3, 14, 0.8, 0.3, 0xff3030], // light bar across the back
  ];
}

// Bugatti Chiron-style: two-tone blue with the "C" line on the side.
function bugatti(): Box[] {
  const dark = 0x0b2a6f;
  const light = 0x2f6fd8;
  return [
    ...supercarBase(),
    [-7.5, 1.5, -10, 15, 3.5, 20, light],
    [-7.5, 1.5, -10, 15, 3.5, 6, dark], // dark rear
    [-7, 5, 3, 14, 0.8, 7, light],
    [-6.5, 5, -4, 13, 3, 7, GLASS_DARK],
    [-5.5, 8, -3, 11, 0.7, 5, dark],
    [-7, 5, -10, 14, 1.5, 6, dark],
    [-7.7, 2, -5, 0.3, 4, 0.6, RIM], // the chrome "C" curve
    [-7.7, 5.4, -5, 0.3, 0.6, 5, RIM],
    [7.4, 2, -5, 0.3, 4, 0.6, RIM],
    [7.4, 5.4, -5, 0.3, 0.6, 5, RIM],
    [-1.5, 1.5, 10, 3, 3, 0.4, RIM], // horseshoe grille
    [-0.8, 2, 10.1, 1.6, 2, 0.4, INTAKE],
    [-6.5, 3.5, 10, 3, 1.5, 0.3, 0xfff6c8],
    [3.5, 3.5, 10, 3, 1.5, 0.3, 0xfff6c8],
    [-7, 4, -10.3, 14, 0.6, 0.3, 0xff3030],
  ];
}

export const vehicles = {
  police_car: ferrari,
  blue_car: bugatti,
  green_car: () => lamborghini(0x7bd400), // Verde Mantis
  orange_car: () => lamborghini(0xff7a00), // Arancio
  purple_car: porsche911,
  taxi: grabCab,
  grab_car: grabCar,
  blue_truck: doubleDecker,
  red_truck: singleDecker,
};

// ---------- Marina Bay promenade (replaces the grass) ----------
// Big grey granite slabs; on some rows timber decking takes over on one side,
// like along the waterfront. The row is 25 tiles wide, top at y = 6.

const GRANITE = [0xd5d2cb, 0xc9c5bd, 0xdcd9d2];
const TIMBER = [0xa47148, 0x8f5f3a];

export function promenade(variant: number) {
  const H = 6;
  const HALF = 200;
  const boxes: Box[] = [[-HALF, 0, -8, HALF * 2, H - 0.1, 16, 0xbdb8ae]];
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
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// ---------- MacBooks floating on the water (replace the lily pads) ----------
// Open laptop: aluminium unibody, black keyboard, display with the notch.
// The screen stands at the back (+z) so the player can stand on the keyboard.

function macbook(body: number): Box[] {
  const boxes: Box[] = [
    [-5.5, 0, -4, 11, 0.8, 7.5, body], // base
    [-4.6, 0.8, -0.6, 9.2, 0.05, 3.6, 0x111111], // keyboard well
    [-1.8, 0.8, -3.5, 3.6, 0.05, 2.4, 0xa9adb2], // trackpad
    [-5.5, 0.8, 3.3, 11, 7, 0.5, body], // lid
    [-5, 1.3, 3.2, 10, 6, 0.1, 0x101418], // display bezel
    // macOS-like wallpaper
    [-4.6, 1.6, 3.15, 9.2, 2.6, 0.1, 0x3949ab],
    [-4.6, 4.2, 3.15, 9.2, 2.6, 0.1, 0x8e24aa],
    [-2, 2.5, 3.1, 4, 2.5, 0.1, 0xec407a],
    [-0.6, 6.8, 3.1, 1.2, 0.5, 0.1, 0x000000], // notch
    [-4.6, 6.5, 3.1, 9.2, 0.3, 0.1, 0xdddddd], // menu bar
  ];
  // keys
  for (let row = 0; row < 4; row++) {
    for (let k = 0; k < 10; k++) {
      boxes.push([-4.4 + k * 0.9, 0.85, -0.4 + row * 0.85, 0.7, 0.1, 0.65, 0x2b2b2b]);
    }
  }
  return boxes;
}

export const macbooks = () =>
  [0xc8ccd0, 0x6e7177].map((c) =>
    voxelModel(macbook(c), { castShadow: true, receiveShadow: true })
  );
