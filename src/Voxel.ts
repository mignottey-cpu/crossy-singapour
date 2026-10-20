import {
  BoxGeometry,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshLambertMaterial,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

// One voxel = 1/16 of a tile, same scale as the original .obj models.
export const VOXEL = 1 / 16;

// [x, y, z, width, height, depth, color] in voxel units.
// x/z are measured from the model's center, y from the ground.
export type Box = [number, number, number, number, number, number, number];

const material = new MeshLambertMaterial({ vertexColors: true });

function boxGeometry([x, y, z, w, h, d, color]: Box): BufferGeometry {
  const geometry = new BoxGeometry(w * VOXEL, h * VOXEL, d * VOXEL);
  geometry.translate(
    (x + w / 2) * VOXEL,
    (y + h / 2) * VOXEL,
    (z + d / 2) * VOXEL
  );
  const c = new Color(color);
  const colors: number[] = [];
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
}

// How far (in voxels) a face is pushed out to stop it flickering against
// another face lying exactly on the same plane.
const FACE_NUDGE = 0.03;

// When two boxes have faces on the same plane that overlap, the GPU cannot
// tell which one is in front and they flicker ("z-fighting"). Details are
// listed after what they sit on (a stripe after the wall it is painted on),
// so the later box gets its face pushed slightly outwards and always wins.
export function separateCoplanarFaces(boxes: Box[]): Box[] {
  const out = boxes.map((b) => [...b] as Box);
  // faces grouped by plane: axis (0-2), direction (-1/1) and position
  const planes = new Map<string, { i: number; r: number[] }[]>();
  boxes.forEach((box, i) => {
    for (let axis = 0; axis < 3; axis++) {
      const [u, v] = [0, 1, 2].filter((a) => a !== axis);
      const r = [box[u], box[u] + box[u + 3], box[v], box[v] + box[v + 3]];
      for (const dir of [-1, 1]) {
        const pos = box[axis] + (dir > 0 ? box[axis + 3] : 0);
        const key = `${axis}${dir}${pos.toFixed(4)}`;
        let list = planes.get(key);
        if (!list) planes.set(key, (list = []));
        list.push({ i, r });
      }
    }
  });
  for (const [key, faces] of planes) {
    if (faces.length < 2) continue;
    const axis = Number(key[0]);
    const dir = key[1] === "-" ? -1 : 1;
    // each face sits one step above the overlapping faces listed before it
    const level: number[] = [];
    faces.forEach((f, k) => {
      level[k] = 0;
      for (let j = 0; j < k; j++) {
        const g = faces[j];
        const overlap =
          Math.min(f.r[1], g.r[1]) - Math.max(f.r[0], g.r[0]) > 1e-6 &&
          Math.min(f.r[3], g.r[3]) - Math.max(f.r[2], g.r[2]) > 1e-6;
        if (overlap) level[k] = Math.max(level[k], level[j] + 1);
      }
      if (level[k] > 0) {
        const box = out[f.i];
        const nudge = level[k] * FACE_NUDGE;
        if (dir < 0) box[axis] -= nudge;
        box[axis + 3] += nudge;
      }
    });
  }
  return out;
}

// Builds a single mesh (wrapped in a Group, like OBJLoader output) from boxes.
export function voxelModel(
  boxes: Box[],
  { castShadow = true, receiveShadow = false } = {}
): Group {
  const mesh = new Mesh(
    mergeGeometries(separateCoplanarFaces(boxes).map(boxGeometry)),
    material
  );
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  const group = new Group();
  group.add(mesh);
  return group;
}
