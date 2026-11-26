import { test } from "node:test";
import assert from "node:assert/strict";
import { filterEquipment } from "../client/src/catalog.js";

const items = [
  { name: "Canon camera", category: "Cameras", status: "available", assetTag: "CAM-1", description: "Mirrorless" },
  { name: "Audio recorder", category: "Audio", status: "on-loan", assetTag: "AUD-1", description: "Field kit" },
];

test("catalog filters category, availability, and normalized search together", () => {
  assert.deepEqual(filterEquipment(items, { category: "Cameras", available: true, query: "  MIRRORLESS " }), [items[0]]);
  assert.deepEqual(filterEquipment(items, { category: "Audio", available: true }), []);
  assert.deepEqual(filterEquipment(items, { query: "aud-1" }), [items[1]]);
});
