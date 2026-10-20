import { Box } from "./Voxel";

// Tiny 5x7 pixel font to write formulas and words with voxels.
// Text is laid out so it reads correctly from the game camera, which looks
// from -z: characters advance towards -x.

const GLYPHS: Record<string, string[]> = {
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  "π": ["00000", "11111", "01010", "01010", "01010", "01010", "01010"],
  "Σ": ["11111", "10000", "01000", "00100", "01000", "10000", "11111"],
  "∫": ["00011", "00100", "00100", "00100", "00100", "00100", "11000"],
  "√": ["00111", "00100", "00100", "00100", "10100", "01100", "00100"],
  "∞": ["00000", "00000", "01010", "10101", "01010", "00000", "00000"],
  "Δ": ["00100", "00100", "01010", "01010", "10001", "10001", "11111"],
  "=": ["00000", "00000", "11111", "00000", "11111", "00000", "00000"],
  "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
  "%": ["11000", "11001", "00010", "00100", "01000", "10011", "00011"],
  $: ["00100", "01111", "10100", "01110", "00101", "11110", "00100"],
  "(": ["00010", "00100", "01000", "01000", "01000", "00100", "00010"],
  ")": ["01000", "00100", "00010", "00010", "00010", "00100", "01000"],
  "²": ["01100", "00010", "00100", "01110", "00000", "00000", "00000"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  a: ["00000", "00000", "01110", "00001", "01111", "10001", "01111"],
  b: ["10000", "10000", "10110", "11001", "10001", "10001", "11110"],
  c: ["00000", "00000", "01110", "10000", "10000", "10001", "01110"],
  d: ["00001", "00001", "01101", "10011", "10001", "10001", "01111"],
  e: ["00000", "00000", "01110", "10001", "11111", "10000", "01110"],
  f: ["00110", "01001", "01000", "11100", "01000", "01000", "01000"],
  i: ["00100", "00000", "01100", "00100", "00100", "00100", "01110"],
  m: ["00000", "00000", "11010", "10101", "10101", "10101", "10101"],
  n: ["00000", "00000", "10110", "11001", "10001", "10001", "10001"],
  r: ["00000", "00000", "10110", "11001", "10000", "10000", "10000"],
  x: ["00000", "00000", "10001", "01010", "00100", "01010", "10001"],
  y: ["00000", "00000", "10001", "10001", "01111", "00001", "01110"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

const ADVANCE = 6; // 5 pixels + 1 pixel spacing

export const textWidth = (text: string, pixel = 1) =>
  ([...text].length * ADVANCE - 1) * pixel;

// Calls `pixelRun(col, row, length)` for each horizontal run of lit pixels.
function eachRun(
  text: string,
  pixelRun: (col: number, row: number, length: number) => void
) {
  [...text].forEach((ch, i) => {
    const rows = GLYPHS[ch] ?? GLYPHS[" "];
    rows.forEach((bits, row) => {
      let start = -1;
      for (let c = 0; c <= bits.length; c++) {
        if (bits[c] === "1") {
          if (start < 0) start = c;
        } else if (start >= 0) {
          pixelRun(i * ADVANCE + start, row, c - start);
          start = -1;
        }
      }
    });
  });
}

// Text lying flat on the ground, centred on (cx, cz), top of the text towards +z.
export function flatText(
  text: string, cx: number, y: number, cz: number, color: number,
  pixel = 1, thickness = 0.1
): Box[] {
  const boxes: Box[] = [];
  const left = cx + textWidth(text, pixel) / 2; // text advances towards -x
  const top = cz + (7 * pixel) / 2;
  eachRun(text, (col, row, len) => {
    boxes.push([
      left - (col + len) * pixel, y, top - (row + 1) * pixel,
      len * pixel, thickness, pixel, color,
    ]);
  });
  return boxes;
}

// Text standing up on a face looking at -z, centred on (cx, cy), at depth z.
export function wallText(
  text: string, cx: number, cy: number, z: number, color: number,
  pixel = 1, thickness = 0.1
): Box[] {
  const boxes: Box[] = [];
  const left = cx + textWidth(text, pixel) / 2;
  const top = cy + (7 * pixel) / 2;
  eachRun(text, (col, row, len) => {
    boxes.push([
      left - (col + len) * pixel, top - (row + 1) * pixel, z - thickness,
      len * pixel, pixel, thickness, color,
    ]);
  });
  return boxes;
}
