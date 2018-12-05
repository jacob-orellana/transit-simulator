QUnit.module('hash_table.js');
/* globals QUnit HashTable */
/* eslint-disable no-magic-numbers */
/* eslint no-underscore-dangle: 0 */

// CATEGORY PARTITION METHOD
/*
  Categories  | Values
  -----------------------
  buckets     | 0  7  13
              |
  size        | 0  1  2
              |
  hashFunction| f(x) = x + 4  f(x) = x f(x) = 4
*/

QUnit.test('test an empty has table', (assert) => {
  const testHash = new HashTable((element) => element);
  assert.deepEqual(testHash.size, 0);
  assert.deepEqual(testHash.has(9), false);
  assert.deepEqual(testHash.get(0), undefined);
  assert.deepEqual(testHash.delete(5), false);
  // setting the first item in the HashTable
  testHash.set(9, 2);
  assert.deepEqual(testHash.size, 1);
  assert.deepEqual(testHash.has(9), true);
  assert.deepEqual(testHash.get(9), 2);
  assert.deepEqual(testHash.delete(9), true);
});

QUnit.test('test a resize', (assert) => {
  const testHash = new HashTable((element) => element + 4);
  assert.deepEqual(testHash._buckets.length, 7);
  // put enough elements in the hash table to cause a resize
  testHash.set(1, 5);
  testHash.set(4, 1);
  testHash.set(10, 0);
  testHash.set(13, 3);
  testHash.set(21, 4);
  // check to see if the bucket has been resized and elements are in the right index
  assert.deepEqual(testHash._buckets.length, 17);
  assert.deepEqual(testHash._buckets[0], [[13, 3]]);
  assert.deepEqual(testHash._buckets[14], [[10, 0]]);
  assert.deepEqual(testHash._buckets[8], [[4, 1], [21, 4]]);
});

QUnit.test('test elements in the same bucket', (assert) => {
  const testHash = new HashTable((element) => element);
  testHash.set(4, 1);
  // testHash.set(4, 4);
  // testHash.set(4, 10);
  // testHash.set(4, 13);
  // testHash.set(4, 21);
  // test methods when multiple numbers are in one buckets
  console.log(testHash._buckets);
  assert.deepEqual(testHash._buckets[4], [[4, 21]]);
  assert.deepEqual(testHash.has(4), true);
  assert.deepEqual(testHash.get(4), 9);
  assert.deepEqual(testHash.delete(4), true);
});
