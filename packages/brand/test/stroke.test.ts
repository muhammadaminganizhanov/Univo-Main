import assert from "node:assert/strict";
import { test } from "node:test";
import { strokeGeometry } from "../src/stroke.ts";

test("wordmark proportions: 4 members → 9 stems, height 6w + dot room", () => {
  const g = strokeGeometry(4);
  assert.equal(g.width, 400); // w + 8 pitches of 3w
  assert.equal(g.top, -32);
  assert.equal(g.height, 96); // same 6w as the logo
  assert.equal(g.nodes.length, 4);
});

test("dots sit like the logo's: Ø1.5w, gap 0.5w over the crest (cy = −20)", () => {
  const g = strokeGeometry(2);
  for (const n of [g.source, ...g.nodes]) assert.equal(n.cy, -20);
  assert.equal(g.source.cx, 8);
  assert.equal(g.nodes[0]!.cx, 80); // between stems 1 (56) and 2 (104)
});

test("turns are semicircles only: every arc has radius 1.5w", () => {
  const arcs = strokeGeometry(3).d.match(/A(\d+) (\d+)/g) ?? [];
  assert.equal(arcs.length, 6);
  for (const a of arcs) assert.equal(a, "A24 24");
});

test("open end adds one dashed crest and widens the drawing by two pitches", () => {
  const closed = strokeGeometry(4);
  const open = strokeGeometry(4, 0, true);
  assert.equal(open.width - closed.width, 96);
  assert.ok(open.openD?.startsWith("M392 32"));
  assert.ok(open.openNode);
  assert.equal(closed.openD, null);
});

import { skylineGeometry } from "../src/stroke.ts";

test("skyline: crest height carries meaning, turns stay semicircles", () => {
  const g = skylineGeometry(64, [{ height: 40 }, { height: 32 }, { height: 12, groupStart: true }, { height: 6 }], { r: 40, groupGap: 1.5 });
  assert.equal(g.nodes.length, 4);
  // taller crest → dot higher (smaller y)
  assert.ok(g.nodes[0]!.cy < g.nodes[2]!.cy);
  // the group valley is wider: distance between 2nd and 3rd node > between 1st and 2nd
  assert.ok(g.nodes[2]!.cx - g.nodes[1]!.cx > g.nodes[1]!.cx - g.nodes[0]!.cx);
  for (const a of g.d.match(/A([\d.]+) ([\d.]+)/g) ?? []) {
    const [, rx, ry] = a.match(/A([\d.]+) ([\d.]+)/)!;
    assert.equal(rx, ry); // circular arcs only
  }
  assert.ok(g.source.anchor >= 0);
});
