import test from 'node:test';
import assert from 'node:assert/strict';
import { moveSpread } from '../src/utils/scrapbookNavigation.ts';

test('scrapbook spread navigation opens, moves both ways, and stays within the book', () => {
  assert.equal(moveSpread(0, 1, 5), 1);
  assert.equal(moveSpread(1, 1, 5), 2);
  assert.equal(moveSpread(2, -1, 5), 1);
  assert.equal(moveSpread(4, 1, 5), 4);
  assert.equal(moveSpread(0, -1, 5), 0);
});
