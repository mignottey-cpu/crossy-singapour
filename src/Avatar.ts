import { Box, voxelModel } from "./Voxel";

// Player character built from photos: messy dark-brown hair with a middle part,
// thick eyebrows, light-blue linen shirt, blue/white striped trousers,
// tan suede clogs and a black tote bag; in exam mode, a navy suit and a
// briefcase; in haze mode, a protective coverall and an N95 mask.
// Front faces +z (walking direction).
// The model is rescaled to 1 tile tall by CrossyPlayer, so units are arbitrary.

const C = {
  skin: 0xf1c7a8,
  skinShade: 0xe2b08f,
  hair: 0x3b2618,
  hairLight: 0x5c3d27,
  brow: 0x2a1a12,
  eye: 0x3d2416,
  mouth: 0xb5655a,
  white: 0xffffff,
  shirt: 0xc9dcef,
  shirtShade: 0xb3cbe3,
  stripeBlue: 0x8fb8e0,
  stripeWhite: 0xf4f8fb,
  clog: 0xc9a06a,
  bag: 0x1d1d1d,
  strap: 0xeee4d0,
  necklace: 0xc0c0c0,
  suit: 0x1f2a44,
  suitShade: 0x161e33,
  tie: 0x7b1e2b,
  shoe: 0x111111,
  briefcase: 0x6d4c41,
  briefcaseDark: 0x3e2723,
  coverall: 0xf4f6f7,
  seam: 0xc9ced3,
  glove: 0x3f6fd8,
  strap2: 0x4f83cc,
};

const F = 3.5; // front of the head (z)

// Beach outfit: open linen shirt, striped trousers, clogs, tote bag.
function beachOutfit(): Box[] {
  const boxes: Box[] = [
    // clogs
    [-3, 0, -1, 2, 1, 4, C.clog],
    [1, 0, -1, 2, 1, 4, C.clog],
    // waistband
    [-3, 5, 0, 6, 0.5, 2, C.stripeWhite],
    // torso: open linen shirt
    [-3, 5.5, -0.5, 6, 4.5, 2.5, C.shirt],
    [-3, 5.5, 2, 2.6, 4.5, 0.2, C.shirtShade],
    [0.4, 5.5, 2, 2.6, 4.5, 0.2, C.shirtShade],
    [-0.4, 6, 2, 0.8, 4, 0.25, C.skin], // open shirt
    [-1, 9.3, 2, 2, 0.7, 0.25, C.skin],
    [-0.2, 8.4, 2.1, 0.4, 0.4, 0.25, C.necklace],
    [-1.5, 9.6, 2.05, 0.4, 0.4, 0.2, C.necklace],
    [1.1, 9.6, 2.05, 0.4, 0.4, 0.2, C.necklace],
    // collar
    [-2, 9.8, 1.8, 1, 0.6, 0.5, C.stripeWhite],
    [1, 9.8, 1.8, 1, 0.6, 0.5, C.stripeWhite],
    // arms (rolled-up sleeves) + hands
    [-4.5, 6.5, -0.25, 1.5, 3.5, 2, C.shirt],
    [-4.5, 5.5, -0.25, 1.5, 1, 2, C.skin],
    [3, 6.5, -0.25, 1.5, 3.5, 2, C.shirt],
    [3, 5.5, -0.25, 1.5, 1, 2, C.skin],
    // tote bag on the right shoulder
    [4.5, 3.5, -1, 1.5, 3.5, 3, C.bag],
    [4.5, 7, 0.3, 0.6, 3, 0.5, C.strap],
    [3, 9.8, 0.3, 2, 0.5, 0.5, C.strap],
  ];
  // blue and white striped trousers
  for (const x0 of [-3, 1]) {
    for (let i = 0; i < 4; i++) {
      const color = i % 2 ? C.stripeWhite : C.stripeBlue;
      boxes.push([x0 + i * 0.5, 1, 0, 0.5, 4, 2, color]);
    }
  }
  return boxes;
}

// Exam outfit: navy suit, white shirt, tie, black shoes and a briefcase.
function suitOutfit(): Box[] {
  return [
    [-3, 0, -1, 2, 1, 4, C.shoe],
    [1, 0, -1, 2, 1, 4, C.shoe],
    [-3, 1, 0, 2, 4.5, 2, C.suit], // trousers
    [1, 1, 0, 2, 4.5, 2, C.suit],
    [-3, 5, -0.5, 6, 5, 2.5, C.suit], // jacket
    [-1, 6.5, 2, 2, 3.5, 0.2, C.white], // shirt
    [-0.35, 6.2, 2.1, 0.7, 3.4, 0.25, C.tie],
    [-1.6, 6.5, 2.05, 0.6, 3.5, 0.2, C.suitShade], // lapels
    [1, 6.5, 2.05, 0.6, 3.5, 0.2, C.suitShade],
    [-2.6, 7.5, 2.05, 0.8, 0.5, 0.2, C.white], // pocket square
    [-2, 9.8, 1.8, 1, 0.6, 0.5, C.white], // collar
    [1, 9.8, 1.8, 1, 0.6, 0.5, C.white],
    [-4.5, 5.8, -0.25, 1.5, 4.2, 2, C.suit], // sleeves
    [-4.5, 5.3, -0.25, 1.5, 0.5, 2, C.white], // cuffs
    [-4.5, 4.5, -0.25, 1.5, 0.8, 2, C.skin],
    [3, 5.8, -0.25, 1.5, 4.2, 2, C.suit],
    [3, 5.3, -0.25, 1.5, 0.5, 2, C.white],
    [3, 4.5, -0.25, 1.5, 0.8, 2, C.skin],
    // leather briefcase in the right hand
    [4.5, 1.5, -1.5, 1.2, 3.2, 4, C.briefcase],
    [4.6, 4.7, -0.2, 0.8, 0.6, 1.4, C.briefcaseDark],
    [4.4, 2.8, -1.5, 1.4, 0.3, 4, C.briefcaseDark],
  ];
}

// Haze outfit: white protective coverall (hood down, zip, taped seams),
// blue nitrile gloves and overshoes. The N95 mask is added on the face.
function hazmatOutfit(): Box[] {
  return [
    [-3, 0, -1, 2, 1.5, 4, C.glove], // overshoes
    [1, 0, -1, 2, 1.5, 4, C.glove],
    [-3, 1.5, 0, 2, 3.8, 2, C.coverall], // legs
    [1, 1.5, 0, 2, 3.8, 2, C.coverall],
    [-3, 5, -0.5, 6, 5, 2.5, C.coverall], // body
    [-0.2, 5.2, 2, 0.4, 4.8, 0.15, C.seam], // zip
    [-3, 6.2, 2, 6, 0.25, 0.15, C.seam], // taped seams
    [-3.6, 9.4, -1.6, 7.2, 1.6, 2.4, C.coverall], // hood down behind the neck
    [-4.5, 5.8, -0.25, 1.5, 4.2, 2, C.coverall], // sleeves
    [-4.5, 4.4, -0.25, 1.5, 1.4, 2, C.glove],
    [3, 5.8, -0.25, 1.5, 4.2, 2, C.coverall],
    [3, 4.4, -0.25, 1.5, 1.4, 2, C.glove],
  ];
}

// N95 mask over the nose and mouth, with its straps going round the head.
const n95Mask: Box[] = [
  [-2.3, 11.4, F - 0.1, 4.6, 2.5, 0.9, 0xf5f5f5],
  [-1.6, 11.7, F + 0.8, 3.2, 1.8, 0.3, 0xf5f5f5], // cup
  [-0.4, 12.2, F + 1.1, 0.8, 0.8, 0.2, 0xd0d0d0], // valve
  [-3.6, 12.6, -2.6, 0.2, 0.4, 6.2, C.strap2],
  [3.4, 12.6, -2.6, 0.2, 0.4, 6.2, C.strap2],
];

type Outfit = "beach" | "suit" | "hazmat";

function me(outfit: Outfit): Box[] {
  const clothes =
    outfit === "suit" ? suitOutfit() : outfit === "hazmat" ? hazmatOutfit() : beachOutfit();
  const boxes: Box[] = [
    ...clothes,
    // neck
    [-1, 10, 0, 2, 1, 2, C.skin],
    // head
    [-3.5, 11, -2.5, 7, 6, 6, C.skin],
    [-3.8, 13, 0, 0.3, 1.5, 1, C.skinShade], // ears
    [3.5, 13, 0, 0.3, 1.5, 1, C.skinShade],
    // face
    [-2.7, 13.4, F, 1.6, 1, 0.15, C.white],
    [1.1, 13.4, F, 1.6, 1, 0.15, C.white],
    [-2, 13.4, F, 0.8, 1, 0.25, C.eye],
    [1.2, 13.4, F, 0.8, 1, 0.25, C.eye],
    [-2.9, 14.8, F, 2.1, 0.6, 0.25, C.brow],
    [0.8, 14.8, F, 2.1, 0.6, 0.25, C.brow],
    [-0.5, 12.5, F, 1, 1.4, 0.5, C.skinShade], // nose
    [-1, 11.8, F, 2, 0.3, 0.2, C.mouth],
    // hair: voluminous and messy, parted in the middle
    [-4, 16.5, -3, 8, 2.5, 7, C.hair],
    [-4, 12, -3, 0.5, 4.5, 6.5, C.hair],
    [3.5, 12, -3, 0.5, 4.5, 6.5, C.hair],
    [-4, 11.5, -3, 8, 5, 0.5, C.hair],
    [-4, 15.7, F, 3.6, 1.3, 0.6, C.hair],
    [0.4, 15.7, F, 3.6, 1.3, 0.6, C.hair],
    [-4, 14.6, F, 1.2, 0.8, 0.6, C.hair],
    [2.8, 14.6, F, 1.2, 0.8, 0.6, C.hair],
    [-3, 19, -1, 2, 1, 2, C.hair],
    [1, 19, 0, 2, 1, 3, C.hairLight],
    [-1, 19, -2.5, 2.5, 0.8, 2, C.hairLight],
    [-4.6, 15, 0, 0.6, 1.5, 2, C.hairLight],
    [4, 15.5, -1.5, 0.6, 1.5, 2, C.hair],
    [-2, 18.5, 2.5, 2, 1, 1.5, C.hairLight],
  ];

  if (outfit === "hazmat") boxes.push(...n95Mask);
  return boxes;
}

export const avatar = (outfit: Outfit = "beach") =>
  voxelModel(me(outfit), { castShadow: true, receiveShadow: true });
