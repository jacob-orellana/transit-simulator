/* exported HashTable */

function mod(value, modulus) {
  const result = value % modulus;
  return result < 0 ? result + modulus : result;
}

function isPseudoPrime(number) {
  if (number <= 2 || number % 2 === 0) {
    return false;
  }
  let residue = 1;
  for (let i = number - 1, power = 2; i > 0; i >>>= 1, power *= power, power %= number) {
    if (i & 1) {
      residue *= power;
      residue %= number;
    }
  }
  return residue === 1;
}

function increaseToPseudoPrime(number) {
  let result = Math.ceil((Math.max(number, 2) - 1) / 2) * 2 + 1;
  while (!isPseudoPrime(result)) {
    result += 2;
  }
  return result;
}

function createBuckets(count) {
  const result = Array(count);
  for (let i = result.length; i--;) {
    result[i] = [];
  }
  return result;
}

const INITIAL_HASH_TABLE_CAPACITY = 7; // eslint-disable-line no-magic-numbers
const MAXIMUM_LOAD_FACTOR = 2 / 3; // eslint-disable-line no-magic-numbers

class HashTable {
  constructor(hashFunction) {
    this._hashFunction = (element) => mod(hashFunction(element), this._buckets.length);
    this.keys = [];
    this.clear();
  }

  clear() {
    this._buckets = createBuckets(increaseToPseudoPrime(INITIAL_HASH_TABLE_CAPACITY));
    this._size = 0;
  }

  _resize() {
    const oldArray = this._buckets;
    this._buckets = createBuckets(increaseToPseudoPrime(2 * oldArray.length));
    this._size = 0;
    for (const bucket of oldArray) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  get size() {
    return this._size;
  }

  has(key) {
    return this._buckets[this._hashFunction(key)].map((pair) => pair[0]).includes(key);
  }

  get(key) {
    const bucket = this._buckets[this._hashFunction(key)];
    const index = bucket.findIndex((pair) => pair[0] === key);
    if (index >= 0) {
      return bucket[index][1];
    }
    return undefined;
  }

  set(key, value) {
    const bucket = this._buckets[this._hashFunction(key)];
    const index = bucket.findIndex((pair) => pair[0] === key);
    if (index >= 0) {
      bucket[index][1] = value;
    } else {
      bucket.push([key, value]);
      ++this._size;
      if (this._size / this._buckets.length > MAXIMUM_LOAD_FACTOR) {
        this._resize();
      }
    }
    return this;
  }

  delete(key) {
    const bucket = this._buckets[this._hashFunction(key)];
    const index = bucket.findIndex((pair) => pair[0] === key);
    if (index >= 0) {
      --this._size;
      bucket.splice(index, 1);
      return true;
    }
    return false;
  }
}
