QUnit.module('hash_table.js');
/* globals QUnit HashTable */
/* eslint-disable no-magic-numbers */

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
  // put enough elements in the hash table to cause a resize
  testHash.set(1, 5);
  testHash.set(4, 1);
  testHash.set(10, 0);
  testHash.set(13, 3);
  console.log(testHash);  
  testHash.set(21, 4);
  console.log(testHash);
  // check to see if elements have been moved according to the resize
  assert.deepEqual(testHash.get(1), 5);
  assert.deepEqual(testHash.get(4), 8);
  assert.deepEqual(testHash.get(10), 14);
  assert.deepEqual(testHash.get(13), 0);
  assert.deepEqual(testHash.get(21), 8);
});

// QUnit.test('test elements in the same bucket', (assert) => {
//   const testHash = new HashTable(() => 4);
//   testHash.set(4, 1);
//   testHash.set(4, 4);
//   testHash.set(4, 10);
//   testHash.set(4, 13);
//   testHash.set(4, 21);
//   // test methods when multiple numbers are in one buckets
//   console.log(testHash.size);
//   assert.deepEqual(testHash._buckets[4], [
//     [
//       4,
//       21,
//     ],
// ]);
//   assert.deepEqual(testHash.has(4), true);
//   assert.deepEqual(testHash.get(4), 9);
//   assert.deepEqual(testHash.delete(4), true);
// });
