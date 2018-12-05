QUnit.module('hash_table.js');
/* globals QUnit HashTable mod isPseudoPrime increaseToPseudoPrime createBuckets */
/* eslint-disable no-magic-numbers */
/* eslint no-underscore-dangle: 0 */

// CATEGORY PARTITION METHOD
/*
  - You could have 7 buckets or more than 7 buckets.
  - The size of your hash table could  be 0 or greater than zero.
  - The hashFunction you pass when your create a table can return the element or change the element
*/

// This test case works with a hash table that is empty, having 7 buckets, and
// a hasFunction that doesn't change the element.
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

// This test case works with a hash table that is not empty, has more than 7
// buckets and has a hashFunction that does change the element.
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
  // test the other function on resized hash table
  assert.deepEqual(testHash.size, 5);
  assert.deepEqual(testHash.has(10), true);
  assert.deepEqual(testHash.has(11), false);
  assert.deepEqual(testHash.get(13), 3);
  assert.deepEqual(testHash.delete(9), false);
  assert.deepEqual(testHash.delete(10), true);
});

// This test case tests different values sent to the mod function that the hash table uses
QUnit.test('test the mod function', (assert) => {
  // test when the value is smaller than the modulus
  assert.deepEqual(mod(3, 5), 3);
  // test when the value is larger than the modulus
  assert.deepEqual(mod(5, 2), 1);
  // test when result is < 0
  assert.deepEqual(mod(-3, 5), 2);
  assert.deepEqual(mod(-5, 2), 1);
  // test with zeros
  assert.deepEqual(mod(0, 5), 0);
  assert.deepEqual(mod(5, 0), NaN);
});

// This test case tests different values sent to the isPseudoPrime function that the hash table uses
QUnit.test('test the isPseudoPrime function', (assert) => {
  // test base case
  assert.deepEqual(isPseudoPrime(2), false);
  assert.deepEqual(isPseudoPrime(8), false);
  // test a prime number
  assert.deepEqual(isPseudoPrime(7), true);
  assert.deepEqual(isPseudoPrime(17), true);
});

// This test case tests different values sent to the increaseToPseudoPrime function that the hash table uses
QUnit.test('test the increaseToPseudoPrime function', (assert) => {
  // test increasing a number that is already prime
  assert.deepEqual(increaseToPseudoPrime(17), 17);
  assert.deepEqual(increaseToPseudoPrime(23), 23);
  // test a number that is not prime number
  assert.deepEqual(increaseToPseudoPrime(10), 11);
  assert.deepEqual(increaseToPseudoPrime(30), 31);
});

// This test case tests different values sent to the createBuckets function that the hash table uses
QUnit.test('test the createBuckets function', (assert) => {
  // test a count of zero
  assert.deepEqual(createBuckets(0), []);
  // test a count of more than zero
  assert.deepEqual(createBuckets(3), [[], [], []]);
});
