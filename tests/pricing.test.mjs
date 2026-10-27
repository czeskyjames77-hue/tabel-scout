import { test } from "node:test";
import assert from "node:assert/strict";
import { deletionQuote, managementQuote } from "../assets/pricing.mjs";
test("deletion prices use commissioned count, bill only successes", () => {
  for (const [count, unit] of [
    [5, 29],
    [9, 29],
    [10, 19],
    [24, 19],
    [25, 15],
    [49, 15],
    [50, 12],
    [99, 12],
    [100, 9],
  ])
    assert.equal(deletionQuote(count, 2).total, unit * 2);
  assert.deepEqual(deletionQuote(60, 40), {
    count: 60,
    successes: 40,
    unit: 12,
    total: 480,
    unpaid: 20,
    individual: false,
  });
  assert.equal(deletionQuote(10, 40).successes, 10);
  assert.equal(deletionQuote(-1, -1).total, 0);
  assert.equal(deletionQuote(4).individual, true);
  assert.equal(deletionQuote(5).individual, false);
});
test("management prices sum both star groups at every boundary", () => {
  for (const [count, price] of [
    [0, 39],
    [5, 39],
    [6, 69],
    [15, 69],
    [16, 99],
    [30, 99],
    [31, 149],
  ])
    assert.equal(
      managementQuote(Math.max(0, count - 1), Math.min(count, 1)).price,
      price,
    );
  assert.deepEqual(managementQuote(20, 4), {
    count: 24,
    price: 99,
    tier: "16–30",
  });
});
