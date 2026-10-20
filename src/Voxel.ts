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

// Builds a single mesh (wrapped in a Group, like OBJLoader output) from boxes.
export function voxelModel(
  boxes: Box[],
  { castShadow = true, receiveShadow = false } = {}
): Group {
  const mesh = new Mesh(mergeGeometries(boxes.map(boxGeometry)), material);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  const group = new Group();
  group.add(mesh);
  return group;
}
