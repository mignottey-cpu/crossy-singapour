import { Box, voxelModel } from "./Voxel";
import { flatText, wallText } from "./PixelFont";

// "Love" mode, shown while the Copine skin is worn: a night out of love and
// music. Jazz cafés, night clubs and futuristic towers, a piano-key road, a
// violet river with floating records and hearts, speakers, the TV Girl
// poster and Luidji singing on stage. Same level and gameplay as the others.
// Units are 1/16 of a tile (see Voxel.ts); sizes match the models replaced.
// The camera looks from -z, so "front" details are placed on the -z side.

export const LOVE_SKY = 0x2d1b45;
export const LOVE_LIGHT = 0xffe3f3;

const HALF = 200; // a row is 25 tiles wide
const PINK = 0xff5fa2;
const HOT_PINK = 0xff2d8a;
const LIGHT_PINK = 0xffc1dc;
const LILAC = 0xc39bd3;
const PURPLE = 0x6a3d9a;
const NIGHT = 0x2b1d3f;
const CYAN = 0x4dd9ff;
const GOLD = 0xf2c230;
const CREAM = 0xfff1e0;
const WHITE = 0xffffff;
const BLACK = 0x161616;
const WHEEL = 0x222222;
const GLASS_DARK = 0x2b2440;

// Mirror boxes front to back, so details face +z instead of -z.
const flipZ = (boxes: Box[]): Box[] =>
  boxes.map(([x, y, z, w, h, d, c]): Box => [-(x + w), y, -z - d, w, h, d, c]);

// ---------- Ground: a pink boulevard ----------
// Rows alternate: plain slabs, a light-up dance floor, hearts painted on it.

export function loveGround(variant: number) {
  const H = 6;
  const slabs = [0xf0c6e4, 0xe6b6dc, 0xf6d3ea];
  const boxes: Box[] = [[-HALF, 0, -8, HALF * 2, H - 0.1, 16, 0xd29fc8]];
  const shift = variant === 0 ? 0 : 16;
  for (let x = -HALF - shift, i = 0; x < HALF; x += 32, i++) {
    const x0 = Math.max(x, -HALF);
    const w = Math.min(x + 32, HALF) - x0;
    boxes.push([x0 + 0.15, H - 0.2, -7.85, w - 0.3, 0.2, 15.7, slabs[i % 3]]);
  }
  if (variant === 1) {
    // dance floor squares, like in a disco
    const lights = [0xff7ab6, 0x7fd8ff, 0xffe36e, 0xb388ff];
    for (let x = -HALF, i = 0; x < HALF; x += 8, i++) {
      for (let row = 0; row < 2; row++) {
        boxes.push([x + 0.3, H, -7.7 + row * 8, 7.4, 0.05, 7.4, lights[(i + row * 2) % 4]]);
      }
    }
  }
  if (variant === 2) {
    for (let x = -HALF + 20, i = 0; x < HALF - 10; x += 41, i++) {
      boxes.push(...flatText("♥", x, H, i % 2 ? 3 : -3, i % 2 ? HOT_PINK : WHITE, 1, 0.05));
    }
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// ---------- Road: asphalt edged with piano keys ----------

function pianoEdge(z: number, H: number): Box[] {
  const boxes: Box[] = [[-HALF, 0, z, HALF * 2, H + 0.2, 2.2, 0xf7f3ea]];
  // black keys in groups of 2 and 3, like on a keyboard
  const pattern = [1, 1, 0, 1, 1, 1, 0];
  for (let x = -HALF, i = 0; x < HALF; x += 2, i++) {
    boxes.push([x + 1.75, H + 0.2, z, 0.25, 0.05, 2.2, 0x9e9e9e]); // key gaps
    if (pattern[i % 7]) boxes.push([x + 1.2, H + 0.2, z + (z < 0 ? 0 : 0.9), 1.1, 0.3, 1.3, BLACK]);
  }
  return boxes;
}

export function pianoRoad() {
  const H = 4;
  const boxes: Box[] = [
    [-HALF, 0, -8, HALF * 2, H, 16, 0x3a3048],
    ...pianoEdge(-8, H),
    ...pianoEdge(5.8, H),
  ];
  for (let x = -HALF; x < HALF; x += 12) {
    boxes.push([x, H, -0.25, 6, 0.05, 0.5, PINK]); // neon pink dashes
  }
  for (let x = -HALF + 30, i = 0; x < HALF; x += 70, i++) {
    boxes.push(...flatText("♥", x, H + 0.03, i % 2 ? 3 : -3, 0x6b4f80, 0.6, 0.03));
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// ---------- River: violet water with little floating hearts ----------

export function violetRiver() {
  const boxes: Box[] = [[-HALF, 0, -8, HALF * 2, 2, 16, 0x7e57c2]];
  for (let x = -HALF + 4, i = 0; x < HALF; x += 7 + (i % 5), i++) {
    boxes.push([x, 2, ((i * 5) % 14) - 7, 1 + (i % 2), 0.05, 0.6, i % 3 ? 0x9f7fe0 : 0xd1b3ff]);
  }
  for (let x = -HALF + 15, i = 0; x < HALF; x += 47, i++) {
    boxes.push(...flatText("♥", x, 2.02, i % 2 ? -4 : 4, 0xe08fd0, 0.5, 0.03));
  }
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

export const WATER_SPLASH = 0xe0b3ff;

// Rows of giant vinyl records floating down the river (replace the logs).
// Length in tiles (1-4).
function vinyl(cx: number, label: number): Box[] {
  const y = 3;
  return [
    [cx - 7, y, -4, 14, 1.4, 8, BLACK], // round-ish disc
    [cx - 4, y, -7, 8, 1.4, 14, BLACK],
    [cx - 6, y, -6, 12, 1.4, 12, BLACK],
    [cx - 6.5, y + 1.4, -1, 13, 0.05, 0.3, 0x3a3a3a], // grooves shine
    [cx - 0.5, y + 1.4, -6.5, 0.3, 0.05, 13, 0x3a3a3a],
    [cx - 2.5, y + 1.4, -2.5, 5, 0.15, 5, label], // label
    [cx - 1.7, y + 1.4, -3.2, 3.4, 0.15, 6.4, label],
    [cx - 0.4, y + 1.55, -0.4, 0.8, 0.05, 0.8, 0x111111], // hole
  ];
}

function vinylRow(tiles: number): Box[] {
  const L = tiles === 4 ? 62 : tiles * 16;
  const step = L / tiles;
  const labels = [PINK, CYAN, GOLD, LILAC];
  const boxes: Box[] = [];
  for (let i = 0; i < tiles; i++) boxes.push(...vinyl(-L / 2 + step * (i + 0.5), labels[(i + tiles) % 4]));
  return boxes;
}

export const vinylRows = () =>
  [1, 2, 3, 4].map((t) => voxelModel(vinylRow(t), { castShadow: true, receiveShadow: true }));

// Pink heart-shaped floats (replace the lily pads).
function heartFloat(): Box[] {
  return [
    ...flatText("♥", 0, 0, 1, HOT_PINK, 1.8, 1),
    ...flatText("♥", 0, 1, 1, LIGHT_PINK, 1.2, 0.3),
  ];
}

export const heartFloats = () => [voxelModel(heartFloat(), { castShadow: true, receiveShadow: true })];

// ---------- Decor (replaces the trees) ----------

// Street lamp topped with a neon heart, lit on both sides.
function heartLamp(): Box[] {
  const heart = wallText("♥", 0, 20, -0.6, HOT_PINK, 1.3, 1.2);
  return [
    [-2, 0, -2, 4, 1.5, 4, 0x4a4a5a],
    [-0.5, 1.5, -0.5, 1, 14, 1, 0x4a4a5a],
    [-2.5, 15, -0.6, 5, 0.6, 1.2, 0x4a4a5a],
    ...heart,
    ...flipZ(heart),
  ];
}

// Pile of record sleeves with a vinyl sticking out, and on top one of
// Frank Ocean's albums lying flat: "channel ORANGE" (2012, plain orange with
// the title in white) or "Blond" (2016, white sleeve, the title in black over
// the photo of him with green hair, his hand on his face).
function recordPile(top: Box[]): Box[] {
  const sleeves = [0x5c6bc0, 0xf8bbd0, 0x26a69a, 0xffd54f, 0x8d6e63];
  const boxes: Box[] = [];
  sleeves.forEach((c, i) => {
    const dx = ((i * 7) % 3) - 1;
    const dz = ((i * 5) % 3) - 1;
    boxes.push([-6 + dx * 0.6, i * 0.9, -6 + dz * 0.6, 12, 0.9, 12, c]);
  });
  boxes.push([-7.5, 1.9, -4, 3, 0.4, 8, BLACK], [-8.2, 1.9, -2.5, 1, 0.4, 5, BLACK]); // record sticking out
  boxes.push([-8.1, 1.95, -0.6, 0.6, 0.4, 1.2, PINK]);
  return [...boxes, ...top];
}

const PILE_TOP = 4.5;

function channelOrange(): Box[] {
  const y = PILE_TOP;
  return [
    [-6, y, -6, 12, 0.3, 12, 0xee702c],
    ...flatText("channel ORANGE", 0, y + 0.3, 2.5, WHITE, 0.14, 0.05),
  ];
}

function blond(): Box[] {
  const y = PILE_TOP;
  const t = y + 0.3;
  const skin = 0x6d4232;
  return [
    [-6, y, -6, 12, 0.3, 12, 0xeeeeee],
    ...flatText("blond", 0, t, 4.6, 0x111111, 0.3, 0.05),
    // the photo: grey tiled wall, green hair, a hand over his face
    [-3.2, t, -5, 6.4, 0.05, 8.2, 0x8f8a84],
    [-3.2, t + 0.01, -1, 6.4, 0.05, 0.12, 0x7a756f],
    [-3.2, t + 0.01, 1.5, 6.4, 0.05, 0.12, 0x7a756f],
    [-1.8, t + 0.02, -5, 4.8, 0.05, 3.2, skin], // shoulders
    [-1, t + 0.03, -2, 2.6, 0.05, 2.4, skin], // face
    [-1.1, t + 0.04, 0.2, 2.8, 0.05, 1.3, 0x7cc47a], // green hair
    [-0.4, t + 0.05, -1.6, 1.6, 0.05, 1.8, 0x9c6650], // hand
    [-1.5, t + 0.04, -3.6, 1, 0.05, 1.6, 0x9c6650], // arm
    [-4.5, t, -5.7, 1.4, 0.05, 0.6, 0x222222], // barcode and advisory sticker
    [3, t, -5.7, 1.5, 0.05, 0.7, 0x111111],
  ];
}

// Retro microphone on a tall stand, like in jazz clubs.
function micStand(): Box[] {
  return [
    [-3, 0, -3, 6, 0.6, 6, 0x333333], // base
    [-0.4, 0.6, -0.4, 0.8, 15, 0.8, 0x9e9e9e],
    [-1.4, 15, -1.6, 2.8, 4.5, 2.8, 0xcfd8dc], // grille
    [-1.6, 16.5, -1.8, 3.2, 0.6, 3.2, 0x90a4ae],
    [-1.6, 18, -1.8, 3.2, 0.6, 3.2, 0x90a4ae],
    [-1.1, 19.5, -1.3, 2.2, 0.8, 2.2, 0xcfd8dc],
    [-0.6, 14, -1.2, 1.2, 1.2, 1.2, GOLD], // clip
  ];
}

// Electric guitar standing on its stand: cherry body, white pickguard,
// rosewood neck and a headstock with its tuning pegs. Faces -z.
function guitar(): Box[] {
  const body = 0xc62828;
  const boxes: Box[] = [
    [-3, 0, -2.5, 6, 0.6, 5, 0x333333], // stand
    [-0.3, 0.6, 1, 0.6, 9, 0.6, 0x333333],
    [-4, 1.5, -1, 8, 5, 2, body], // lower bout
    [-3, 6.5, -1, 6, 1.5, 2, body], // waist
    [-3.5, 8, -1, 7, 3.5, 2, body], // upper bout
    [1.5, 10.5, -1, 1.5, 2.5, 2, body], // horn
    [-2.5, 2.5, -1.1, 3.5, 5, 0.1, 0xf5f5f5], // pickguard
    [-1.6, 6, -1.2, 3.2, 0.8, 0.1, 0x9e9e9e], // pickups
    [-1.6, 8.6, -1.2, 3.2, 0.8, 0.1, 0x9e9e9e],
    [-1.4, 3, -1.2, 2.8, 0.6, 0.1, 0x616161], // bridge
    [2, 3, -1.2, 0.7, 0.7, 0.1, 0xffd54f], // knobs
    [2, 4.3, -1.2, 0.7, 0.7, 0.1, 0xffd54f],
    [-0.7, 11.5, -0.6, 1.4, 9, 1.2, 0x4e342e], // neck
    [-1, 20.5, -0.7, 2, 3.5, 1.4, 0x3e2723], // headstock
  ];
  for (let y = 12.5; y < 20.5; y += 1.3) boxes.push([-0.7, y, -0.65, 1.4, 0.15, 0.05, 0xbdbdbd]); // frets
  for (const x of [-0.45, -0.1, 0.25]) boxes.push([x, 3, -0.7, 0.08, 17.5, 0.05, 0xeeeeee]); // strings
  for (const y of [21, 22.2, 23.4]) {
    boxes.push([-1.6, y, -0.3, 0.6, 0.6, 0.6, 0xcfd8dc], [1, y, -0.3, 0.6, 0.6, 0.6, 0xcfd8dc]); // pegs
  }
  return boxes;
}

export const loveTrees = () => [heartLamp(), recordPile(channelOrange()), recordPile(blond()), micStand(), guitar()].map((b) => voxelModel(b));

// ---------- Obstacles (replace the boulders) ----------

// Round shape facing -z (a speaker cone), made of two crossed boxes.
const round = (cx: number, cy: number, z: number, r: number, depth: number, color: number): Box[] => [
  [cx - r, cy - r * 0.6, z - depth, r * 2, r * 1.2, depth, color],
  [cx - r * 0.6, cy - r, z - depth, r * 1.2, r * 2, depth, color],
];

// Big sound system speaker, with a pink LED strip.
function speaker(): Box[] {
  return [
    [-5, 0, -4, 10, 17, 8, BLACK], // cabinet
    [-5.2, 0, -4.2, 10.4, 0.8, 8.4, 0x333333],
    ...round(0, 5.5, -4, 4, 0.3, 0x3a3a3a), // woofer
    ...round(0, 5.5, -4.3, 2.4, 0.3, 0x555555),
    ...round(0, 5.5, -4.6, 0.9, 0.3, 0x777777),
    ...round(0, 12.5, -4, 2.2, 0.3, 0x3a3a3a), // tweeter
    ...round(0, 12.5, -4.3, 1, 0.3, 0x777777),
    [-4.5, 15.5, -4.2, 9, 0.5, 0.2, PINK], // LED strip
    [-4.5, 15.5, -4, 0.5, 0.5, 8, PINK],
  ];
}

// The picture of TV Girl's "Who Really Cares" cover (2016): a man in blue
// light holding a woman in pink light, on black. 32x32 pixels, one digit per
// pixel (see POSTER_COLORS), taken from the cover.
const POSTER = [
  "00000000001222210000000000000000",
  "00000000000122200000000000000000",
  "00000000000111200000000000000000",
  "00000000000012200000000000000000",
  "00000000000002204000000000000000",
  "00000000000012235300000000000000",
  "00000000000222245430000000000000",
  "00000000001222234444300000000000",
  "00000000002222245544400000000000",
  "00000000002222245545400000000000",
  "00000000002221245554300001100000",
  "00000000002210124554400022110000",
  "00000000012210024544440222100000",
  "00000000022210002444554222100000",
  "00000000122210045555542222100000",
  "00000000122210455555522222100000",
  "00000000112203555555422222100000",
  "00000001111104555554222221000000",
  "00000002110045555542222220000000",
  "00000002210045543422222210000000",
  "00000002211035400222222100000000",
  "00000002210004002222221000003000",
  "00000002210000022222200300033000",
  "00000002210000222221034300344300",
  "00000032210002222203444000444300",
  "00003442122122221345430003444300",
  "00344442212222204544000034444400",
  "04555422212222104430000345544300",
  "45555422222222034000003455544300",
  "45555422221221000000344455544300",
  "45555412221211000003455555544000",
  "44444444111100000034444444444000",
];
const POSTER_COLORS = [0x080810, 0x1e1e78, 0x3246e1, 0x961e78, 0xe61e8c, 0xff78c8];

// The cover on an easel, in its grey poster frame. Faces -z.
function tvGirlPoster(): Box[] {
  const px = 0.4;
  const z = -1;
  const left = (POSTER.length * px) / 2; // the picture reads towards -x
  const top = 18.6;
  const boxes: Box[] = [
    [-0.5, 0, -0.5, 1, 6, 1, 0x5d4037], // easel legs
    [-6, 0, -0.2, 1, 6, 1, 0x5d4037],
    [5, 0, -0.2, 1, 6, 1, 0x5d4037],
    [-7, 5, z, 14, 14.4, 1.2, 0xb8b8b8], // grey poster
  ];
  // one box per run of same-coloured pixels
  POSTER.forEach((row, r) => {
    let start = 0;
    for (let c = 1; c <= row.length; c++) {
      if (c === row.length || row[c] !== row[start]) {
        boxes.push([left - c * px, top - (r + 1) * px, z - 0.1, (c - start) * px, px, 0.1, POSTER_COLORS[+row[start]]]);
        start = c;
      }
    }
  });
  return boxes;
}

// Luidji, the Paris rapper, singing on stage: sunglasses, short beard, black
// jacket on a white T-shirt, a gold chain, the mic in hand, spotlights.
function luidjiOnStage(): Box[] {
  const s = 2.5; // stage height
  const skin = 0x6b4423;
  return [
    [-7, 0, -6, 14, s, 13, 0x3e2723], // stage
    [-7, 0, -6.2, 14, s, 0.2, 0x2a1a17],
    ...wallText("LUIDJI", 0, 1.25, -6.2, CYAN, 0.32, 0.1), // LED name on the front
    // spotlights on the back corners
    [-6.5, s, 5, 1, 12, 1, 0x333333],
    [5.5, s, 5, 1, 12, 1, 0x333333],
    [-7, s + 12, 4, 2, 2, 2.5, 0xfff59d],
    [5, s + 12, 4, 2, 2, 2.5, 0xfff59d],
    // wedge monitor speaker at the front
    [-5.5, s, -5.5, 3.5, 1.8, 2.5, BLACK],
    // Luidji
    [-2, s, -1, 1.6, 1, 2.2, 0x111111], // shoes
    [0.4, s, -1, 1.6, 1, 2.2, 0x111111],
    [-2, s + 1, -0.6, 1.6, 5, 1.6, 0x2b2b3a], // jeans
    [0.4, s + 1, -0.6, 1.6, 5, 1.6, 0x2b2b3a],
    [-2.6, s + 6, -1, 5.2, 5.5, 2.4, 0x1b1b1b], // black jacket
    [-1, s + 7, -1.1, 2, 4.5, 0.1, WHITE], // white T-shirt
    [-1.2, s + 10.2, -1.2, 2.4, 0.4, 0.1, GOLD], // gold chain
    [-0.3, s + 9.4, -1.25, 0.6, 0.8, 0.1, GOLD],
    [-3.6, s + 7, -0.6, 1, 4.5, 1.4, 0x1b1b1b], // free arm
    [-3.6, s + 6.4, -0.6, 1, 0.8, 1.4, skin],
    [2.6, s + 9.5, -1.8, 1, 1.2, 1.8, 0x1b1b1b], // mic arm, raised
    [1.4, s + 10.5, -3, 1.6, 1, 1.6, skin], // hand
    [1.6, s + 11.3, -3.4, 1.1, 1.3, 1.1, 0x9e9e9e], // mic
    [-1, s + 11.5, -0.7, 2, 0.8, 1.4, skin], // neck
    [-1.8, s + 12, -1.3, 3.6, 3.6, 3, skin], // head
    [-1.9, s + 15.3, -1.4, 3.8, 0.7, 3.2, 0x111111], // short hair
    [-1.9, s + 12, -1.4, 3.8, 1.2, 0.2, 0x111111], // beard
    [-1.9, s + 12, -1.3, 0.4, 2.2, 2.4, 0x111111],
    [1.5, s + 12, -1.3, 0.4, 2.2, 2.4, 0x111111],
    [-1.9, s + 13.8, -1.45, 3.8, 0.9, 0.2, 0x0a0a0a], // sunglasses
    [-0.6, s + 13.1, -1.45, 1.2, 0.4, 0.15, 0x3b2312], // nose shadow
  ];
}

// Classic jukebox with its glowing arch.
function jukebox(): Box[] {
  return [
    [-5, 0, -3, 10, 12, 6, 0x8d1c3a],
    [-4, 12, -3, 8, 2, 6, 0x8d1c3a], // arch
    [-2.5, 14, -3, 5, 1.2, 6, 0x8d1c3a],
    [-4.5, 12, -3.2, 1, 2, 0.2, GOLD], // glowing arch lights
    [3.5, 12, -3.2, 1, 2, 0.2, GOLD],
    [-3.5, 14, -3.2, 7, 0.8, 0.2, 0xff9800],
    [-3.5, 7, -3.2, 7, 4, 0.2, 0xfff3e0], // record window
    [-1.5, 8, -3.3, 3, 2, 0.1, BLACK],
    [-3.5, 2, -3.2, 7, 4, 0.2, 0x3a0d1c], // speaker grille
    [-4.8, 1, -3.2, 0.6, 10, 0.2, CYAN], // neon tubes
    [4.2, 1, -3.2, 0.6, 10, 0.2, PINK],
  ];
}

export const loveObstacles = () =>
  [speaker(), tvGirlPoster(), luidjiOnStage(), jukebox()].map((b) => voxelModel(b));

// ---------- Buildings (line the edges of the map) ----------

function floorLines(x: number, z: number, w: number, d: number, from: number, to: number, gap: number, color: number): Box[] {
  const lines: Box[] = [];
  for (let y = from + gap - 1; y < to; y += gap) lines.push([x - 0.1, y, z - 0.1, w + 0.2, 0.5, d + 0.2, color]);
  return lines;
}

// Jazz café: brick front, striped awning, warm windows and a neon sign.
function jazzCafe(): Box[] {
  const brick = 0x8d3b2f;
  const boxes: Box[] = [
    [-7, 0, -4, 14, 20, 8, brick],
    [-7.3, 20, -4.3, 14.6, 1.2, 8.6, 0x5d2a20], // cornice
    [-6, 1, -4.2, 12, 6, 0.2, 0xffcc80], // big warm window
    [-1, 1, -4.3, 2, 6, 0.3, 0x4e342e], // door
    [-5, 10, -4.2, 3, 3.5, 0.2, 0xffe0b2], // upstairs windows
    [2, 10, -4.2, 3, 3.5, 0.2, 0xffe0b2],
    ...wallText("JAZZ", 0, 16.5, -4.2, 0xffd54f, 0.55, 0.15), // neon sign
    [-6, 14.5, -4.15, 12, 0.3, 0.1, 0xffd54f],
  ];
  // striped awning over the café
  for (let x = -7, i = 0; x < 7; x += 2, i++) {
    boxes.push([x, 7.5, -7, 2, 0.6, 3, i % 2 ? CREAM : 0xc62828]);
  }
  // café tables on the pavement
  boxes.push([-6, 0, -9, 3, 3, 3, 0x5d4037], [3, 0, -9, 3, 3, 3, 0x5d4037]);
  return boxes;
}

// Night club: a black box with neon edges, the sign and a disco ball.
function nightClub(): Box[] {
  const H = 18;
  const boxes: Box[] = [
    [-7, 0, -4, 14, H, 8, 0x1d1a24],
    [-7.1, 0, -4.1, 0.6, H, 0.3, PINK], // neon edges
    [6.5, 0, -4.1, 0.6, H, 0.3, CYAN],
    [-7.1, H - 0.6, -4.1, 14.2, 0.6, 0.3, 0xb388ff],
    ...wallText("CLUB", 0, 13, -4, HOT_PINK, 0.6, 0.15),
    [-2, 0, -4.2, 4, 6, 0.2, 0x4a148c], // door
    [-4, 0, -6.5, 0.5, 2.5, 0.5, GOLD], // red rope
    [3.5, 0, -6.5, 0.5, 2.5, 0.5, GOLD],
    [-3.6, 1.8, -6.4, 7.2, 0.4, 0.3, 0xc62828],
    // disco ball on the roof
    [-0.2, H, -0.2, 0.4, 3, 0.4, 0x9e9e9e],
    [-2.5, H + 3, -2.5, 5, 5, 5, 0xe0e0e0],
  ];
  for (const [x, y] of [[-2.6, H + 4], [0.5, H + 6], [1.5, H + 3.5], [-1.5, H + 6.5]]) {
    boxes.push([x, y, -2.6, 1, 1, 0.1, 0xb3e5fc]); // mirror facets
  }
  return boxes;
}

// Futuristic tower that twists as it rises, with cyan light lines.
function twistTower(): Box[] {
  const boxes: Box[] = [];
  for (let i = 0; i < 11; i++) {
    const off = Math.sin(i / 2.2) * 1.6;
    boxes.push([-5 + off, i * 4, -3.5 - off * 0.5, 10, 4, 7, i % 2 ? 0x7e57c2 : 0x6a4bb0]);
    boxes.push([-5.1 + off, i * 4 + 3.4, -3.6 - off * 0.5, 10.2, 0.4, 7.2, CYAN]);
  }
  boxes.push([-0.4, 44, -0.4, 0.8, 8, 0.8, 0xbdbdbd]); // antenna
  boxes.push(...wallText("♥", 0, 53, -0.4, HOT_PINK, 0.8, 0.8));
  return boxes;
}

// Glass dome with a floating ring of light.
function futureDome(): Box[] {
  const boxes: Box[] = [[-8, 0, -5, 16, 2, 10, 0x9575cd]];
  for (let i = 0; i < 9; i++) {
    const t = i / 9;
    const w = 7 * Math.sqrt(1 - t * t);
    boxes.push([-w, 2 + i, -w * 0.7, w * 2, 1, w * 1.4, i % 2 ? 0x80deea : 0x4dd0e1]);
  }
  boxes.push([-8, 14, -5.5, 16, 0.6, 1, PINK], [-8, 14, 4.5, 16, 0.6, 1, PINK]);
  boxes.push([-8.5, 14, -5.5, 1, 0.6, 11, PINK], [7.5, 14, -5.5, 1, 0.6, 11, PINK]);
  return boxes;
}

// Tall pink tower with a big neon heart on top and "LOVE" lit up.
function loveTower(): Box[] {
  const H = 34;
  return [
    [-6, 0, -4, 12, H, 8, 0xf48fb1],
    ...floorLines(-6, -4, 12, 8, 0, H, 3, 0xfce4ec),
    [-4.5, H, -3, 9, 2, 6, 0xec407a],
    ...wallText("LOVE", 0, 24, -4.1, WHITE, 0.55, 0.15),
    ...wallText("♥", 0, H + 8, 0, HOT_PINK, 2, 1.5),
  ];
}

// Record shop with a giant record on its roof.
function recordShop(): Box[] {
  return [
    [-7, 0, -4, 14, 12, 8, 0x26a69a],
    [-6, 1, -4.2, 12, 6, 0.2, 0xb2dfdb], // shop window
    [-5, 2, -4.3, 2.5, 2.5, 0.1, PINK], // record sleeves on display
    [-1.2, 2, -4.3, 2.5, 2.5, 0.1, GOLD],
    [2.6, 2, -4.3, 2.5, 2.5, 0.1, 0x7e57c2],
    ...wallText("VINYL", 0, 9.5, -4.1, WHITE, 0.4, 0.15),
    // giant record standing on the roof
    ...round(0, 19, 0.5, 7, 1, BLACK),
    ...round(0, 19, -0.5, 2.5, 0.2, HOT_PINK),
  ];
}

// Little jazz club with a warm marquee of bulbs.
function bluesBar(): Box[] {
  const boxes: Box[] = [
    [-7, 0, -4, 14, 14, 8, 0x283593],
    [-7, 14, -4, 14, 1.5, 8, 0x1a237e],
    [-6, 1, -4.2, 4, 5, 0.2, 0xffe0b2],
    [2, 1, -4.2, 4, 5, 0.2, 0xffe0b2],
    [-1, 0, -4.2, 2, 6, 0.2, 0x3e2723],
    [-6.5, 7.5, -5.5, 13, 4, 1.5, BLACK], // marquee
    ...wallText("BAR", 0, 9.5, -5.5, 0xffd54f, 0.4, 0.15),
  ];
  for (let x = -6.2; x < 6.5; x += 1.6) {
    boxes.push([x, 11.6, -5.6, 0.6, 0.6, 0.6, 0xfff59d]); // bulbs
    boxes.push([x, 7.3, -5.6, 0.6, 0.6, 0.6, 0xfff59d]);
  }
  return boxes;
}

export const loveBuildings = () =>
  [jazzCafe(), nightClub(), twistTower(), futureDome(), loveTower(), recordShop(), bluesBar()].map((b) =>
    voxelModel(b)
  );

// ---------- Vehicles ----------
// Built along z with the front on +z; the road rotates them.

function car(body: number, top: number | null): Box[] {
  const boxes: Box[] = [
    [-8, 0, -6, 16, 3, 3, WHEEL],
    [-8, 0, 3, 16, 3, 3, WHEEL],
    [-7.5, 2, -8, 15, 5, 16, body],
    [-6, 4, 8, 3, 1.5, 0.3, 0xfff6c8], // headlights
    [3, 4, 8, 3, 1.5, 0.3, 0xfff6c8],
    [-6, 4, -8.3, 3, 1.5, 0.3, 0xd32f2f],
    [3, 4, -8.3, 3, 1.5, 0.3, 0xd32f2f],
  ];
  if (top !== null) {
    boxes.push([-6.5, 7, -5, 13, 4, 9, GLASS_DARK], [-6.5, 11, -5, 13, 1, 9, top]);
  }
  return boxes;
}

// Pink 50s convertible with a couple and white leather seats.
function pinkCadillac(): Box[] {
  return [
    ...car(0xf06292, null),
    [-7.5, 2, -10, 15, 3, 2, 0xf06292], // long tail with fins
    [-7.6, 5, -10, 1, 2, 3, 0xf06292],
    [6.6, 5, -10, 1, 2, 3, 0xf06292],
    [-6, 7, 3, 12, 2.5, 0.3, 0xb3e5fc], // windscreen
    [-6, 7, -4, 12, 2, 4, CREAM], // seats
    [-4.5, 7, -2.5, 3, 4, 2, 0x37474f], // the couple
    [-4.3, 11, -2.3, 2.6, 2.6, 2.6, 0xd9a066],
    [1.5, 7, -2.5, 3, 4, 2, 0xe91e63],
    [1.7, 11, -2.3, 2.6, 2.6, 2.6, 0xf1c27d],
    [1.4, 12.8, -2.6, 3, 1.4, 3.2, 0x4e342e],
    [-0.5, 12, -2, 1, 1, 0.3, HOT_PINK], // little heart between them
  ];
}

// Mint vintage car.
const mintCar = () => [...car(0x80cbc4, WHITE), [-7.6, 4, -6, 0.2, 1, 12, WHITE], [7.4, 4, -6, 0.2, 1, 12, WHITE]];

// Taxi with a heart sign on the roof.
const loveTaxi = () => [
  ...car(0xffffff, 0xffffff),
  [-7.6, 3.5, -6, 0.2, 2, 12, PINK],
  [7.4, 3.5, -6, 0.2, 2, 12, PINK],
  ...wallText("♥", 0, 14.5, 0, HOT_PINK, 0.6, 1.2),
];

// Convertible with heart balloons tied on the back.
function balloonCar(): Box[] {
  return [
    ...car(0x9575cd, null),
    [-6, 7, 3, 12, 2.5, 0.3, 0xb3e5fc],
    [-6, 7, -4, 12, 2, 4, 0x4a148c],
    [-5, 9, -7, 0.2, 9, 0.2, WHITE], // strings
    [4.8, 9, -7, 0.2, 11, 0.2, WHITE],
    ...wallText("♥", -5, 19, -7, 0xff1744, 0.7, 1.5),
    ...wallText("♥", 5, 21, -7, PINK, 0.7, 1.5),
  ];
}

// Vespa with a couple riding it.
function vespa(): Box[] {
  return [
    [-0.8, 0, -6, 1.6, 3, 3, WHEEL],
    [-0.8, 0, 4, 1.6, 3, 3, WHEEL],
    [-1.8, 2, -6, 3.6, 4, 7, 0xaed581], // body
    [-1.2, 2, 1, 2.4, 2, 5, 0xaed581],
    [-1.4, 4, 5, 2.8, 6, 1.2, 0xaed581], // front shield
    [-3, 10, 5, 6, 0.6, 0.6, 0x9e9e9e], // handlebar
    [-1.5, 6, -4, 3, 1, 5, 0x5d4037], // seat
    [-1.5, 7, -0.5, 3, 4, 2, 0x1565c0], // driver
    [-1.2, 11, -0.4, 2.4, 2.4, 2.4, 0xd9a066],
    [-1.5, 13, -0.6, 3, 1, 2.8, 0xef5350], // helmet
    [-1.5, 7, -3.5, 3, 4, 2, 0xf06292], // passenger hugging
    [-1.2, 11, -3.4, 2.4, 2.4, 2.4, 0xf1c27d],
    [-1.5, 13, -3.6, 3, 1, 2.8, WHITE],
  ];
}

// Crêpes van.
function crepeVan(): Box[] {
  return [
    [-8, 0, -10, 16, 3, 4, WHEEL],
    [-8, 0, 6, 16, 3, 4, WHEEL],
    [-7.5, 2, -13, 15, 13, 26, 0xfff59d],
    [-6, 8, 13, 12, 4, 0.3, GLASS_DARK],
    [-7.7, 6, -9, 0.3, 5, 12, 0x4e342e], // serving hatch
    [7.4, 6, -9, 0.3, 5, 12, 0x4e342e],
    [-8.5, 11, -10, 1, 0.5, 14, PINK], // awnings
    [7.5, 11, -10, 1, 0.5, 14, PINK],
    [-3, 15, -6, 6, 3, 6, 0xffcc80], // giant crêpe on the roof
    [-2, 18, -5, 4, 0.5, 4, 0x6d4c41], // chocolate
  ];
}

// White stretch limousine.
function limousine(): Box[] {
  return [
    [-8, 0, -12, 16, 3, 4, WHEEL],
    [-8, 0, 8, 16, 3, 4, WHEEL],
    [-7.5, 2, -15, 15, 5, 30, 0xf5f5f5],
    [-6.5, 7, -12, 13, 3.5, 21, GLASS_DARK],
    [-6.5, 10.5, -12, 13, 0.8, 21, 0xf5f5f5],
    [-6, 4, 15, 3, 1.5, 0.3, 0xfff6c8],
    [3, 4, 15, 3, 1.5, 0.3, 0xfff6c8],
    [-7.6, 4, -13, 0.2, 0.6, 26, GOLD],
    [7.4, 4, -13, 0.2, 0.6, 26, GOLD],
  ];
}

// Tour bus of the band, black and purple with a pink stripe.
function tourBus(): Box[] {
  return [
    [-8, 0, -12, 16, 4, 4, WHEEL],
    [-8, 0, 7, 16, 4, 4, WHEEL],
    [-7.5, 2, -16, 15, 20, 32, 0x212121],
    [-7.7, 4, -16, 15.4, 2, 32, PINK],
    [-7.7, 7, -16, 15.4, 1, 32, 0x7e57c2],
    [-7.7, 10, -14, 15.4, 6, 28, 0x37304a], // tinted windows
    [-6, 9, 16, 12, 8, 0.3, GLASS_DARK],
    [-5, 18, 16, 10, 1.5, 0.4, 0xb388ff], // destination sign
    [-6.5, 4, 16, 2.5, 1.5, 0.4, 0xfff6c8],
    [4, 4, 16, 2.5, 1.5, 0.4, 0xfff6c8],
    [-7.5, 22, -15, 15, 0.5, 30, 0x111111],
  ];
}

// Truck carrying a DJ booth with speakers and a DJ.
function djTruck(): Box[] {
  return [
    [-8, 0, -11, 16, 3, 4, WHEEL],
    [-8, 0, 7, 16, 3, 4, WHEEL],
    [-7, 2, 6, 14, 9, 7, 0x512da8], // cab
    [-6, 6, 12.8, 12, 3, 0.3, GLASS_DARK],
    [-7.5, 2, -13, 15, 2, 19, 0x333333], // platform
    [-6.5, 4, -12, 4, 8, 4, BLACK], // speakers
    [2.5, 4, -12, 4, 8, 4, BLACK],
    [-6, 9, -12.1, 3, 2, 0.1, 0x555555],
    [3, 9, -12.1, 3, 2, 0.1, 0x555555],
    [-3, 4, -4, 6, 4, 3, 0xe0e0e0], // DJ booth
    [-2.5, 8, -3.5, 2, 0.3, 2, BLACK], // turntables
    [0.5, 8, -3.5, 2, 0.3, 2, BLACK],
    [-1, 4, 0, 2, 5, 2, 0x00bcd4], // DJ
    [-0.8, 9, 0.2, 1.6, 1.6, 1.6, 0x8d5524],
    [-1.2, 10.4, 0, 2.4, 0.5, 2, 0xff4081], // headphones
  ];
}

export const loveVehicles = {
  police_car: pinkCadillac,
  blue_car: mintCar,
  green_car: vespa,
  orange_car: crepeVan,
  purple_car: loveTaxi,
  taxi: balloonCar,
  grab_car: limousine,
  blue_truck: tourBus,
  red_truck: djTruck,
};

// ---------- Love Train (replaces the railroad, train and crossing lights) ----------

const BASE = 1.6; // same as the MRT: the track is a bit higher than the train's ground

export function neonTrack() {
  const H = 8;
  const boxes: Box[] = [
    [-HALF, 0, -8, HALF * 2, H, 16, 0x4a3a5e],
    [-HALF, H, -6, HALF * 2, 0.1, 12, NIGHT],
    [-HALF, H + 0.3, -4.5, HALF * 2, 0.6, 0.6, PINK], // glowing rails
    [-HALF, H + 0.3, 3.5, HALF * 2, 0.6, 0.6, PINK],
    [-HALF, H, 5.6, HALF * 2, 0.8, 0.8, CYAN],
  ];
  for (let x = -HALF; x < HALF; x += 4) boxes.push([x, H, -5.5, 1.5, 0.3, 10, 0x5c4a73]);
  return voxelModel(boxes, { castShadow: false, receiveShadow: true });
}

// One car of the pink "Love Train", centred on x = 0, with hearts along its
// sides; `cab` adds a driver's cab at that end.
function trainCar(cab: "none" | "front" | "back"): Box[] {
  const y = BASE;
  const L = 62; // a bit shorter than 4 tiles so cars do not overlap
  const x0 = -L / 2;
  const boxes: Box[] = [
    [x0, y + 1, -5.5, L, 13, 11, 0xf8bbd0],
    [x0, y + 14, -5, L, 1, 10, WHITE],
    [x0, y + 3.8, -5.6, L, 1.2, 11.2, CYAN],
    [x0 + 2, y + 7, -5.6, L - 4, 4, 11.2, GLASS_DARK],
    [x0 + 6, y - 0.8, -4, 8, 1.8, 8, 0x222222],
    [x0 + L - 14, y - 0.8, -4, 8, 1.8, 8, 0x222222],
  ];
  for (let x = x0 + 6; x < x0 + L - 4; x += 12) boxes.push([x, y + 7, -5.65, 1, 4, 11.3, 0xf8bbd0]);
  for (let x = x0 + 8; x < x0 + L - 4; x += 12) {
    boxes.push(...wallText("♥", x, y + 12.3, -5.5, HOT_PINK, 0.3, 0.15));
  }
  const nose = (x: number, dir: number): Box[] => [
    [x, y + 1, -5, 2.5 * dir, 11, 10, 0xf8bbd0],
    [x + 2.5 * dir - (dir > 0 ? 0.3 : 0), y + 6, -4, 0.3, 5, 8, GLASS_DARK],
    [x + 2.5 * dir - (dir > 0 ? 0.3 : 0), y + 2.5, -4, 0.35, 1, 1.5, 0xfff6c8],
    [x + 2.5 * dir - (dir > 0 ? 0.3 : 0), y + 2.5, 2.5, 0.35, 1, 1.5, 0xfff6c8],
  ];
  const fix = ([x, yy, z, w, h, d, c]: Box): Box => (w < 0 ? [x + w, yy, z, -w, h, d, c] : [x, yy, z, w, h, d, c]);
  if (cab === "back") boxes.push(...nose(x0 + L, 1).map(fix));
  if (cab === "front") boxes.push(...nose(x0, -1).map(fix));
  return boxes;
}

export const loveTrainPieces = () => ({
  front: voxelModel(trainCar("front")),
  middle: voxelModel(trainCar("none")),
  back: voxelModel(trainCar("back")),
});

// Heart-shaped sign with two lamps that flash when the train comes.
// Faces +z here: the row turns it towards the camera.
function heartSign(left: boolean, right: boolean): Box[] {
  const off = 0x5a5a5a;
  const on = 0xff4081;
  return [
    [-0.5, 0, -0.5, 1, 23, 1, 0x9e9e9e],
    ...flipZ(wallText("♥", 0, 19, -0.5, 0xe91e63, 1.3, 0.8)),
    [-2.5, 23, -1, 2, 1.5, 2, left ? on : off],
    [0.5, 23, -1, 2, 1.5, 2, right ? on : off],
    [-3, 22.5, -1, 6, 0.5, 2, 0x333333],
  ];
}

export const heartSigns = () => ({
  inactive: voxelModel(heartSign(false, false)),
  active_0: voxelModel(heartSign(true, false)),
  active_1: voxelModel(heartSign(false, true)),
});

// ---------- Coin: a pink heart token ----------

export function heartToken(disc: (face: number, rim: number) => Box[], bothFaces: (b: Box[]) => Box[]): Box[] {
  return [...disc(0xff5fa2, 0xffc1dc), ...bothFaces(wallText("♥", 0, 4, -0.65, WHITE, 0.7, 0.15))];
}
