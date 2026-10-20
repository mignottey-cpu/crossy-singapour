import { Box, voxelModel } from "./Voxel";
import { wallText } from "./PixelFont";
import { byTheme } from "./Theme";

// Coins to pick up. Each mode has its own look but every coin is worth one.
// A coin stands up (face towards -z) and spins; units are 1/16 of a tile.

// Octagonal disc centred on x = 0, from y = 0 to y = 8.
function disc(face: number, rim: number): Box[] {
  return [
    [-4, 1, -0.5, 8, 6, 1, rim],
    [-3, 0, -0.5, 6, 8, 1, rim],
    [-3.4, 1.4, -0.65, 6.8, 5.2, 1.3, face],
    [-2.4, 0.6, -0.65, 4.8, 6.8, 1.3, face],
  ];
}

// The same emblem on both faces, readable from the front and the back.
function bothFaces(front: Box[]): Box[] {
  const back = front.map(([x, y, z, w, h, d, c]): Box => [-(x + w), y, -z - d, w, h, d, c]);
  return [...front, ...back];
}

// Singapore $1 coin: gold-coloured and octagonal.
function sgDollar(): Box[] {
  return [
    ...disc(0xe0b13a, 0xf2c94c),
    ...bothFaces([
      ...wallText("$1", 0, 4, -0.65, 0x9c7413, 0.55, 0.15),
    ]),
  ];
}

// Exam mode: a gold token with the best grade, A+.
function gradeToken(): Box[] {
  return [
    ...disc(0xf2c230, 0xffe082),
    ...bothFaces(wallText("A+", 0, 4, -0.65, 0xd32f2f, 0.55, 0.15)),
  ];
}

// Haze mode: a "clean air" token, mint green with a white leaf.
function cleanAirToken(): Box[] {
  return [
    ...disc(0x4dd0c4, 0xb2ebf2),
    ...bothFaces([
      [-1, 2.5, -0.8, 2, 3.5, 0.15, 0xffffff],
      [-2, 3.5, -0.8, 4, 1.5, 0.15, 0xffffff],
      [-0.2, 1.5, -0.8, 0.4, 1, 0.15, 0x2e7d32], // stem
      [-0.15, 2.8, -0.85, 0.3, 3, 0.1, 0x2e7d32], // vein
    ]),
  ];
}

export const coin = () =>
  voxelModel(byTheme({ singapore: sgDollar, exam: gradeToken, haze: cleanAirToken })(), {
    castShadow: true,
    receiveShadow: false,
  });
