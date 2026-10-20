// Generates many levels with the real map code and checks that the player
// can always find a way forward. Run with: bun test tests/
import { mock, test, expect } from "bun:test";
import { Object3D, Mesh, BoxGeometry } from "three";
const SRC = import.meta.dir + "/../src";
// Stand-ins for the 3D models: only the map logic is tested here.
const node = () => new Object3D();
const sized = () => new Mesh(new BoxGeometry(1, 0.2, 0.5));
const pool = { getRandom: node, getNode: node, models: { "0": { children: [{ material: {} }] }, "1": { children: [{ material: {}, clone: node }] } } };
mock.module(SRC + "/ModelLoader", () => ({
  default: {
    _grass: pool, _tree: pool, _boulder: pool, _building: pool, _river: pool, _road: pool,
    _car: { getRandom: sized }, _log: { getRandom: sized }, _lilyPad: { getRandom: sized },
    _railroad: pool, _trainLight: pool, _train: { withSize: sized }, _coin: pool,
  },
}));
mock.module(SRC + "/AudioManager", () => ({ default: { playAsync() {}, sounds: { train: { move: {} } } } }));
mock.module("react-native", () => ({ Vibration: { vibrate() {} } }));
mock.module("expo-three", () => ({ Renderer: class {} }));
mock.module("@react-native-async-storage/async-storage", () => ({ default: { getItem: async () => null, setItem: async () => {} } }));
(globalThis as any).TweenLite = { to() {} };

const COLS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
type Snap = { kind: string; open: Set<number> };

// Columns the player can stand on, recorded when the row is created
// (rows are recycled further ahead later on).
function snapshot(map: any, z: number): Snap {
  const row = map.getRow(z);
  if (!row) return { kind: "grass", open: new Set() }; // first row, behind the start
  if (row.type === "grass") return { kind: "grass", open: new Set(COLS.filter((x) => !(`${x}` in row.entity.obstacleMap))) };
  if (row.type === "water" && row.entity.isStaticRow(z)) return { kind: "raft", open: new Set(row.entity.getLilyPadPositions()) };
  return { kind: row.type, open: new Set(COLS) };
}

function pathExists(rows: Snap[], start: number) {
  const seen = new Set<string>([`${start},0`]);
  const queue: [number, number][] = [[start, 0]];
  while (queue.length) {
    const [z, x] = queue.shift()!;
    if (z === rows.length - 1) return true;
    const moves: [number, number][] = [[z + 1, x], [z - 1, x]];
    if (rows[z].kind !== "raft") moves.push([z, x - 1], [z, x + 1]);
    for (const [nz, nx] of moves) {
      const key = `${nz},${nx}`;
      if (nz < start || nz >= rows.length || !COLS.includes(nx) || seen.has(key) || !rows[nz].open.has(nx)) continue;
      seen.add(key); queue.push([nz, nx]);
    }
  }
  return false;
}

test("there is always a way forward", async () => {
  const { CrossyGameMap } = await import(SRC + "/CrossyGame");
  const scene = { world: new Object3D() };
  let blocked = 0;
  const RUNS = 1000, ROWS = 200;
  for (let run = 0; run < RUNS; run++) {
    const map = new CrossyGameMap({ heroWidth: 0.7, onCollide() {}, scene });
    map.reset(); map.init();
    const rows: Snap[] = [];
    for (let z = 0; z < map.rowCount; z++) rows[z] = snapshot(map, z);
    while (map.rowCount < ROWS) { map.newRow(); rows[map.rowCount - 1] = snapshot(map, map.rowCount - 1); }
    if (!pathExists(rows, 8)) blocked++;
  }
  console.log(`levels with no way forward: ${blocked} / ${RUNS} (each ${ROWS} rows)`);
  expect(blocked).toBe(0);
});
