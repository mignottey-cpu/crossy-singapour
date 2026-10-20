import { Box, voxelModel } from "./Voxel";
import { flatText, wallText } from "./PixelFont";

// "Exam" mode: the same level, but everything turns into student work.
// Units are 1/16 of a tile (see Voxel.ts). Sizes match the Singapore models
// they replace so the gameplay does not change.

const HALF = 200; // rows are 25 tiles wide
const PAPER = 0xfcfcf6;
const INK = 0x1a237e;
const RED = 0xe53935;
const WOOD = 0x8b5a2b;

// ---------- Ground: exam paper (replaces the promenade) ----------
// French Seyès ruling: red margin, violet writing lines, blue interlines.

const NOTES = ["Δ=b²-4ac", "Σx/n", "dy/dx", "e=mc²"];

export function paperGround(variant: number) {
  const H = 6;
  const y = H;
  const boxes: Box[] = [[-HALF, 0, -8, HALF * 2, H, 16, PAPER]];
  if (variant === 1) {
    // "petits carreaux" (5 mm squares)
    for (let z = -8; z < 8; z += 4) {
      boxes.push([-HALF, y, z - 0.1, HALF * 2, 0.05, 0.2, 0xb9cdf0]);
    }
    for (let x = -HALF; x < HALF; x += 4) {
      boxes.push([x - 0.1, y, -8, 0.2, 0.06, 16, 0xb9cdf0]);
    }
  } else {
    // Seyès "grands carreaux"
    for (let z = -8; z < 8; z += 2) {
      const main = (z + 8) % 8 === 0;
      boxes.push([
        -HALF, y, z - (main ? 0.15 : 0.08), HALF * 2, 0.05,
        main ? 0.3 : 0.16, main ? 0x8e7cc3 : 0xb7c6ee,
      ]);
    }
    for (let x = -HALF; x < HALF; x += 8) {
      boxes.push([x - 0.12, y, -8, 0.24, 0.06, 16, 0x9f8fd0]);
    }
  }
  // red margin (on the left of the screen, which is +x)
  boxes.push([40, y + 0.01, -8, 0.4, 0.06, 16, RED]);
  // a formula written in ink on some sheets
  if (variant < NOTES.length - 1) {
    boxes.push(...flatText(NOTES[variant], -24 + variant * 30, y + 0.02, 0, INK, 0.8, 0.06));
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// ---------- Road: a blackboard ----------

export function blackboardRoad() {
  const H = 4;
  const boxes: Box[] = [
    [-HALF, 0, -8, HALF * 2, H, 16, 0x2f4f3a],
    [-HALF, 0, -8, HALF * 2, H + 0.3, 0.8, WOOD],
    [-HALF, 0, 7.2, HALF * 2, H + 0.3, 0.8, WOOD],
  ];
  for (let x = -HALF; x < HALF; x += 12) {
    boxes.push([x, H, -0.2, 6, 0.05, 0.4, 0xe8efe8]); // chalk dashes
  }
  for (let x = -HALF + 10, i = 0; x < HALF; x += 37, i++) {
    boxes.push([x, H, i % 2 ? 3 : -5.5, 9, 0.03, 2.5, 0x3d5f48]); // smudges
  }
  for (let x = -HALF + 40, i = 0; x < HALF; x += 90, i++) {
    boxes.push(...flatText(["x+y", "f(x)", "2π", "n²"][i % 4], x, H + 0.04, i % 2 ? -4 : 4, 0xcfdccf, 0.6, 0.05));
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// ---------- River: a stream of maths formulas ----------

const STREAM = ["Σx²", "∫f(x)dx", "e=mc²", "√2", "π", "a²+b²=c²", "Δ", "∞", "dy/dx", "%", "$"];

export function formulaRiver() {
  const boxes: Box[] = [[-HALF, 0, -8, HALF * 2, 2, 16, 0x22357a]];
  [-4, 4].forEach((cz, line) => {
    let x = -HALF + 6 + line * 17;
    let i = line * 5;
    while (x < HALF - 10) {
      const text = STREAM[i % STREAM.length];
      const w = [...text].length * 6 * 0.8;
      boxes.push(...flatText(text, x + w / 2, 2, cz, 0x5068c0, 0.8, 0.05));
      x += w + 10;
      i++;
    }
  });
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// Strips of exam paper with a formula, floating down the stream (replace the
// dragon boats). Length in tiles (1-4).
const FORMULAS = ["√2", "e=mc²", "∫f(x)dx", "a²+b²=c²"];

function formulaStrip(tiles: number): Box[] {
  const L = tiles === 4 ? 62 : tiles * 16;
  const x0 = -L / 2;
  const boxes: Box[] = [
    [x0, 2, -5, L, 3, 10, PAPER],
    [x0 + L - 2.5, 5, -5, 0.35, 0.05, 10, RED], // margin
  ];
  for (const z of [-3, 0, 3]) {
    boxes.push([x0, 5, z, L, 0.03, 0.15, 0xb7c6ee]);
  }
  // torn edges
  for (let x = x0 + 1, i = 0; x < x0 + L - 2; x += 3, i++) {
    boxes.push([x, 2, i % 2 ? 4.6 : -5.6, 1.5, 3, 1, PAPER]);
  }
  boxes.push(...flatText(FORMULAS[tiles - 1], 0, 5, 0.3, INK, 1, 0.15));
  return boxes;
}

export const formulaStrips = () =>
  [1, 2, 3, 4].map((t) =>
    voxelModel(formulaStrip(t), { castShadow: true, receiveShadow: true })
  );

// Post-it notes floating on the stream (replace the MacBooks).
function postIt(color: number, curl: number): Box[] {
  return [
    [-4, 0, -4, 8, 0.6, 8, color],
    [2.5, 0.6, -4, 1.5, 0.4, 1.5, curl], // curled corner
    [-3, 0.6, 1.8, 5.5, 0.05, 0.4, INK], // scribbled to-do list
    [-3, 0.6, 0.3, 4, 0.05, 0.4, INK],
    [-3, 0.6, -1.2, 5, 0.05, 0.4, INK],
    [2, 0.6, 1.6, 0.6, 0.06, 0.8, RED], // tick
  ];
}

export const postIts = () =>
  [
    [0xfff176, 0xfff9c4],
    [0xf8bbd0, 0xfce4ec],
  ].map(([c, curl]) => voxelModel(postIt(c, curl), { castShadow: true, receiveShadow: true }));

// ---------- Desk objects sliding on the blackboard (replace the vehicles) ----
// Built along z with the front on +z, about as long as the cars they replace.

function graphingCalculator(): Box[] {
  const boxes: Box[] = [
    [-6, 0, -8, 12, 3, 16, 0x37474f],
    [-4.5, 3, 2.5, 9, 0.3, 4.5, 0x9fb59a], // screen
    [-3.5, 3.3, 4.5, 4, 0.05, 0.4, 0x2e3b2e], // a plotted curve
    [0.5, 3.3, 3.5, 3, 0.05, 0.4, 0x2e3b2e],
  ];
  const keyColors = [0xeceff1, 0xeceff1, 0x1e88e5, 0xeceff1, 0xe53935];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      boxes.push([-5 + col * 2.1, 3, -7 + row * 1.5, 1.4, 0.4, 1.1, keyColors[(row + col) % 5]]);
    }
  }
  return boxes;
}

function stapler(): Box[] {
  return [
    [-3, 0, -8, 6, 1.5, 16, 0x212121],
    [-3, 1.5, -7, 6, 3, 14, 0xd32f2f],
    [-3, 1.5, -8, 6, 4.5, 2, 0x212121], // hinge
    [-2.5, 2.5, 7, 5, 1, 1, 0xb0b4b8], // metal tip
  ];
}

function highlighter(body: number, cap: number): Box[] {
  return [
    [-2.5, 0, -8, 5, 5, 12, body],
    [-2.5, 0, 4, 5, 5, 4, cap],
    [-1, 5, 2, 2, 0.6, 5, cap], // clip
    [-2.6, 1.5, -6, 5.2, 2, 6, 0xffffff], // label
  ];
}

function eraser(): Box[] {
  return [
    [-4, 0, -7, 8, 4, 14, 0xf5f5f5],
    [-4.1, 0, -3, 8.2, 4.1, 9, 0x1e63c8], // cardboard sleeve
    [-4.15, 1.5, -1, 8.3, 1, 5, 0xffffff],
  ];
}

function coffeeCup(): Box[] {
  return [
    [-7, 0, -7, 14, 0.8, 14, 0xffffff], // saucer
    [-4, 0.8, -4, 8, 8, 8, 0xffffff],
    [-4.2, 3.5, -4.2, 8.4, 3, 8.4, 0x8d6e63], // cardboard sleeve
    [-4.5, 8.8, -4.5, 9, 1, 9, 0x3e2723], // lid
    [4, 3, -1, 2, 4, 2, 0xffffff], // handle side
  ];
}

function smartphone(): Box[] {
  return [
    [-4, 0, -8, 8, 1.2, 16, 0x111111],
    [-3.5, 1.2, -7.2, 7, 0.1, 14.4, 0x1e88e5],
    [-3, 1.25, 3, 6, 0.1, 2, 0xffffff], // notifications
    [-3, 1.25, 0, 6, 0.1, 2, 0xffffff],
    [-3, 1.25, -3, 4, 0.1, 2, 0xffeb3b],
    [-1, 1.25, 6.4, 2, 0.1, 0.5, 0x000000], // camera notch
  ];
}

// Giant pencil, 2 tiles long (replaces the double-decker).
function pencil(): Box[] {
  return [
    [-3, 0, -12, 6, 6, 24, 0xf7c42b],
    [-3.1, 1.8, -12, 6.2, 0.4, 24, 0xd9a400], // hexagon edges
    [-3.1, 3.8, -12, 6.2, 0.4, 24, 0xd9a400],
    [-2, 1, 12, 4, 4, 3, 0xe8c28e], // sharpened wood
    [-1, 2, 15, 2, 2, 1, 0x333333], // graphite
    [-3.2, 0, -14, 6.4, 6, 2, 0xc0c0c0], // ferrule
    [-3, 0, -16, 6, 6, 2, 0xf48fb1], // eraser
  ];
}

// Pile of textbooks, as long as a bus.
function textbooks(): Box[] {
  return [
    [-7, 0, -15, 14, 4, 30, 0x1a237e],
    [-6.6, 0.5, -14.6, 13.2, 3, 29.4, 0xf5f0e1], // pages
    [-6.5, 4, -14, 13, 3.5, 28, 0x8e1b2e],
    [-6.1, 4.4, -13.6, 12.2, 2.7, 27.4, 0xf5f0e1],
    [-7, 7.5, -15, 14, 3, 29, 0x1b5e20],
    [-6.6, 7.9, -14.6, 13.2, 2.2, 28.4, 0xf5f0e1],
    [-7.1, 1, -12, 0.2, 2, 8, 0xf2c230], // gold titles on the spines
    [-6.6, 4.8, -10, 0.2, 2, 8, 0xf2c230],
    [-7.1, 8.2, -12, 0.2, 1.6, 8, 0xf2c230],
  ];
}

export const examVehicles = {
  police_car: graphingCalculator,
  blue_car: stapler,
  green_car: () => highlighter(0xfff200, 0xe6d800),
  orange_car: eraser,
  purple_car: () => highlighter(0xff4fa3, 0xe0338a),
  taxi: coffeeCup,
  grab_car: smartphone,
  blue_truck: pencil,
  red_truck: textbooks,
};

// ---------- Desks lit by a lamp ----------

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

// ---------- Exam papers and the professor ----------

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
const SHEET = 0xfbfaf5;
const SHEET_SHADE = 0xe9e6dc;
const SHEET_INK = 0x4f6fae;
const RED_PEN = 0xd62828;

// The game camera looks from -z, so pages are mirrored on x to read correctly.
export const mirrorX = (boxes: Box[]): Box[] =>
  boxes.map(([x, y, z, w, h, d, c]) => [-(x + w), y, z, w, h, d, c]);

// Details drawn on the top sheet of a pile whose top is at height y.
function examSheetTop(y: number): Box[] {
  const boxes: Box[] = [
    [-3.5, y, 3, 7, 0.1, 2, SHEET_SHADE], // header box
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
    boxes.push([-2.4, y, 2 - i, len, 0.08, 0.3, SHEET_INK]);
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
    boxes.push([-4 + o, i * 0.5, -5.5 - o, 8, 0.5, 11, i % 2 ? SHEET_SHADE : SHEET]);
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
    boxes.push([-4 + o, i * 0.6, -5.5 + o / 2, 8, 0.6, 11, i % 3 ? SHEET : SHEET_SHADE]);
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

// ---------- Decor on the paper (replace trees and obstacles) ----------

const BOOK_COLORS = [0x1a237e, 0x8e1b2e, 0x1b5e20, 0xf2c230, 0x4a148c, 0x37474f, 0xe65100];

// Library bookshelf full of books (faces -z, the camera).
function bookshelf(height: number): Box[] {
  const boxes: Box[] = [
    [-6, 0, 2, 12, height, 1, WOOD],
    [-6, 0, -3, 1, height, 5, WOOD],
    [5, 0, -3, 1, height, 5, WOOD],
  ];
  let n = 0;
  for (let y = 0; y < height - 1; y += 6.5) {
    boxes.push([-6, y, -3, 12, 1, 5, WOOD]);
    let x = -5;
    while (x < 4.4) {
      const w = 0.8 + ((n * 7) % 5) * 0.2;
      const h = 3.5 + ((n * 3) % 4) * 0.5;
      if (x + w > 5) break;
      boxes.push([x, y + 1, -2.6, w, h, 4, BOOK_COLORS[n % BOOK_COLORS.length]]);
      x += w + 0.1;
      n++;
    }
  }
  boxes.push([-6, height - 1, -3, 12, 1, 5, WOOD]);
  return boxes;
}

function bookStack(): Box[] {
  const boxes: Box[] = [];
  const sizes = [[10, 7], [9, 6.5], [9.5, 7], [8, 6], [8.5, 6.5]];
  sizes.forEach(([w, d], i) => {
    const o = [0, 0.6, -0.4, 0.3, -0.5][i];
    boxes.push([-w / 2 + o, i * 2, -d / 2 - o / 2, w, 2, d, BOOK_COLORS[i]]);
    boxes.push([-w / 2 + o + 0.3, i * 2 + 0.3, -d / 2 - o / 2 - 0.05, w - 0.6, 1.4, 0.1, 0xf5f0e1]);
  });
  boxes.push([-1, 10, -1, 2, 2, 2, 0xd32f2f], [-0.2, 12, -0.2, 0.4, 0.8, 0.4, 0x5d4037]); // an apple
  return boxes;
}

function standingCoffee(): Box[] {
  return [
    [-3, 0, -3, 6, 10, 6, 0xffffff],
    [-3.2, 3.5, -3.2, 6.4, 3.5, 6.4, 0x8d6e63],
    [-3.4, 10, -3.4, 6.8, 1, 6.8, 0x3e2723],
    [-0.5, 11, -0.5, 1, 2, 1, 0xeeeeee], // steam
    [0.5, 13, 0, 1, 2, 1, 0xeeeeee],
  ];
}

export const examTrees = () => [
  voxelModel(bookshelf(27)),
  voxelModel(bookStack()),
  voxelModel(standingCoffee()),
  ...desks().map((boxes) => voxelModel(boxes)),
];

// Alarm clock ringing for the exam (faces -z).
function alarmClock(): Box[] {
  const red = 0xd32f2f;
  return [
    [-1.5, 0, -1, 1, 2, 1, 0x333333], // feet
    [1, 0, -1, 1, 2, 1, 0x333333],
    [-4, 2, -2, 8, 6, 4, red], // round-ish body
    [-3, 1.5, -2, 6, 8, 4, red],
    [-3, 3, -2.2, 6, 4, 0.3, 0xffffff], // face
    [-2, 2.5, -2.2, 4, 5, 0.3, 0xffffff],
    [-0.2, 4.6, -2.4, 0.4, 2, 0.2, 0x111111], // hands
    [-0.2, 4.6, -2.4, 2, 0.4, 0.2, 0x111111],
    [-4, 9, -1.5, 3, 1.5, 3, 0xf2c230], // bells
    [1, 9, -1.5, 3, 1.5, 3, 0xf2c230],
    [-0.5, 9.5, -0.5, 1, 1.5, 1, 0x333333],
  ];
}

export const examObstacles = () => [
  voxelModel(alarmClock()),
  voxelModel(professor()),
  voxelModel(mirrorX(examPaper())),
  voxelModel(mirrorX(examStack())),
];

// ---------- Buildings along the edges ----------

// ESSEC Asia-Pacific campus (one-north, Singapore): white low-rise building,
// glass bands, rooftop garden and solar panels.
function essecCampus(): Box[] {
  const H = 24;
  const boxes: Box[] = [
    [-7, 0, -4, 14, H, 8, 0xf4f4f0],
    [-7, H, -4, 14, 1, 8, 0xdcdcd6],
    [-6.5, H + 1, -3.5, 6, 0.8, 7, 0x2e7d32], // rooftop garden
    [0.5, H + 1, -3.5, 6, 1.2, 7, 0x1a3a6b], // solar panels
  ];
  for (let f = 0; f < 4; f++) {
    boxes.push([-7.1, 2 + f * 5.5, -4.1, 14.2, 2.5, 8.2, 0x6f9fc4]); // glass bands
  }
  boxes.push([-6, H - 3.2, -4.4, 12, 2.6, 0.3, 0xffffff]);
  boxes.push(...wallText("ESSEC", 0, H - 1.9, -4.4, 0x0b2b5c, 0.38, 0.15));
  return boxes;
}

// Glass office tower with a rising chart on its facade.
function chartTower(): Box[] {
  const H = 36;
  const boxes: Box[] = [
    [-6, 0, -4, 12, H, 8, 0x5d8fb5],
    [-4.5, H, -3, 9, 3, 6, 0x5d8fb5],
  ];
  for (let y = 2; y < H; y += 3) {
    boxes.push([-6.1, y, -4.1, 12.2, 0.4, 8.2, 0xffffff]);
  }
  const bars = [4, 7, 6, 10, 13];
  bars.forEach((h, i) => {
    boxes.push([3.5 - i * 2.2, 10, -4.4, 1.6, h, 0.3, i === 4 ? 0x43a047 : 0xf2c230]);
  });
  return boxes;
}

export const examBuildings = () =>
  [essecCampus(), essecCampus(), bookshelf(44), chartTower()].map((b) => voxelModel(b));

// ---------- Exam hall corridor + students rushing to the exam ----------
// (replace the cycling path and the peloton)

export function examCorridor() {
  const H = 8;
  const boxes: Box[] = [
    [-HALF, 0, -8, HALF * 2, H, 16, 0xd9d4c7],
    [-HALF, H, -7.4, HALF * 2, 0.05, 0.5, 0xf9c22e],
    [-HALF, H, 6.9, HALF * 2, 0.05, 0.5, 0xf9c22e],
    [-HALF, H, -0.1, HALF * 2, 0.04, 0.2, 0xbdb6a6],
  ];
  for (let x = -HALF; x < HALF; x += 16) {
    boxes.push([x - 0.1, H, -8, 0.2, 0.04, 16, 0xbdb6a6]);
  }
  for (let x = -HALF + 48; x < HALF; x += 96) {
    boxes.push(...flatText("EXAM", x, H + 0.05, -3.8, 0x9e9e9e, 0.6, 0.05));
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

const SUITS = [0x1f2a44, 0x263238, 0x3e2723, 0x1f2a44, 0x424242];
const TIES = [0x7b1e2b, 0x1565c0, 0x2e7d32, 0xf2c230];
const HAIRS = [0x3b2618, 0x111111, 0xc59a5b, 0x6d3b1f, 0x8a8a8a];
const SKINS = [0xf0c8a0, 0xd9a066, 0x8d5524];
const BASE = 1.6;

// Student in a suit walking fast towards +x with a briefcase.
function student(b: number, z: number, i: number): Box[] {
  const suit = SUITS[i % SUITS.length];
  const skin = SKINS[(i * 2) % SKINS.length];
  const hair = HAIRS[(i * 3) % HAIRS.length];
  const y = BASE;
  return [
    [b + 0.4, y, z + 0.2, 1.2, 5, 1, suit], // legs mid-stride
    [b - 1.6, y, z - 1.2, 1.2, 5, 1, suit],
    [b + 0.4, y, z + 0.2, 1.8, 0.7, 1, 0x111111],
    [b - 1.6, y, z - 1.2, 1.8, 0.7, 1, 0x111111],
    [b - 1.4, y + 5, z - 1.6, 2.8, 4.5, 3.2, suit],
    [b + 1.4, y + 7.5, z - 0.5, 0.1, 2, 1, 0xffffff],
    [b + 1.45, y + 6.5, z - 0.2, 0.1, 2.5, 0.4, TIES[i % TIES.length]],
    [b - 0.6, y + 5.5, z - 2.3, 1.2, 4, 0.7, suit], // arms
    [b - 0.6, y + 5.5, z + 1.6, 1.2, 4, 0.7, suit],
    [b - 0.6, y + 4.8, z + 1.6, 1.2, 0.8, 0.7, skin],
    [b - 1.8, y + 2.2, z + 2.0, 3.5, 2.6, 0.9, 0x6d4c41], // briefcase
    [b - 1.2, y + 2.2 + 2.6, z + 2.2, 0.4, 0.5, 0.5, 0x3e2723],
    [b - 1.2, y + 9.5, z - 1.2, 2.4, 2.6, 2.4, skin], // head
    [b - 1.4, y + 11.5, z - 1.4, 2.8, 0.9, 2.8, hair],
    [b - 1.4, y + 9.8, z - 1.4, 0.4, 2, 2.8, hair],
  ];
}

const LANES = [-6, -1.5];

function crowd(xs: number[], offset: number): Box[] {
  const boxes: Box[] = [];
  xs.forEach((x, i) => {
    LANES.forEach((z, lane) => {
      boxes.push(...student(x + lane * 4, z, i * 2 + lane + offset));
    });
  });
  return boxes;
}

// Leader of the rush holding an "EXAM" sign (the sign faces the camera).
function signBearer(b: number, z: number): Box[] {
  const y = BASE;
  return [
    ...student(b, z, 1),
    [b + 0.2, y + 6, z - 0.2, 0.4, 9, 0.4, WOOD],
    [b - 4, y + 13, z - 0.6, 8.4, 4, 0.3, 0xffffff],
    ...wallText("EXAM", b + 0.2, y + 15, z - 0.6, RED, 0.6, 0.15),
  ];
}

export const studentRushPieces = () => ({
  front: voxelModel(crowd([-30, -21, -12, -3, 6, 15, 24, 33], 0)),
  middle: voxelModel(crowd([-30, -21, -12, -3, 6, 15, 24, 33], 3)),
  back: voxelModel([...crowd([-30, -21, -12, -3, 6], 6), ...signBearer(20, -3.75)]),
});

// Exam hall clock on a post with two red lamps (faces +z, the row turns it).
function examClock(left: boolean, right: boolean): Box[] {
  const off = 0x5a5a5a;
  const on = 0xff1744;
  return [
    [-0.5, 0, -0.5, 1, 24, 1, 0x9e9e9e],
    [-3.5, 16.5, 0.4, 7, 7, 0.4, 0x212121], // frame
    [-3, 17, 0.7, 6, 6, 0.3, 0xffffff],
    [-0.2, 19.8, 1, 0.4, 2.4, 0.1, 0x111111], // hands
    [-0.2, 19.8, 1, 2.2, 0.4, 0.1, 0x111111],
    [-2.5, 24, -1, 2, 1.5, 2, left ? on : off],
    [0.5, 24, -1, 2, 1.5, 2, right ? on : off],
    [-3, 23.5, -1, 6, 0.5, 2, 0x333333],
  ];
}

export const examClocks = () => ({
  inactive: voxelModel(examClock(false, false)),
  active_0: voxelModel(examClock(true, false)),
  active_1: voxelModel(examClock(false, true)),
});
