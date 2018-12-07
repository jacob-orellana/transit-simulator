/* exported UndirectedEdge UndirectedGraph shortestUndirectedPath */
/* globals identity PriorityQueue HashTable */
/* eslint-disable no-magic-numbers */
/* eslint no-underscore-dangle: 0 */

class UndirectedEdge {
  constructor(weight) {
    this.weight = weight;
  }

  reverse() {
    return this;
  }
}

function hashFunction(letter) {
  const value = 59 * (String(letter).codePointAt(0) || 0);
  return value;
}

class UndirectedGraph {
  constructor(hashfunction = (letter) => {
    const value = 59 * (String(letter).codePointAt(0) || 0);
    return value;
  }) {
    this.hashGraph = new HashTable((index) => hashfunction(index));
    this.vertices = [];
    this.edges = [];
  }

  addVertex(vertex) {
    console.assert(!this.vertices.includes(vertex), 'Vertex already exists in the graph.');
    this.hashGraph.set(vertex);
    this.vertices.push(vertex);
  }

  addEdge(source, edge, destination) {
    const sourceBucket = this.hashGraph._buckets[this.hashGraph._hashFunction(source)];
    const destinationBucket = this.hashGraph._buckets[this.hashGraph._hashFunction(destination)];
    if (source !== destination){
      if (sourceBucket[0][1] === undefined){
        sourceBucket[0].pop();
      }
      if (destinationBucket[0][1] === undefined){
        destinationBucket[0].pop();
      }
      sourceBucket[0].push({[destination]: edge});
      destinationBucket[0].push({[source]: edge});
      this.edges.push(edge);
    }
  }

  getNeighbors(vertex) {
    const bucket = this.hashGraph._buckets[this.hashGraph._hashFunction(vertex)][0];
    const result = [];
    if (bucket[1] !== undefined) {
      for (let i = 1; i < bucket.length; ++i) {
        if (typeof bucket[i] === 'object'){
          const neighbor = Object.entries(bucket[i])[0][0];
          console.log(Object.entries(bucket[i])[0][0])
          if (this.vertices.includes(neighbor)){
            result.push(neighbor);
          }
        }
      }
    }
    return result;
  }

  getEdge(source, destination) {
    const bucket = this.hashGraph._buckets[this.hashGraph._hashFunction(source)][0];
    console.log(this.vertices)
    console.assert(this.vertices.includes(source), 'Graph does not have that vertex source.');
    console.assert(this.vertices.includes(destination), 'Graph does not have that vertex destination.');
    let result = undefined;
    if (bucket[1] !== undefined){
      let vertex = '';
      for (let i = 1; i < bucket.length; ++i){
        vertex = bucket[i];
        if (destination.name === Object.entries(vertex)[0][0]){
          result = Object.entries(vertex)[0][1];
        }
      }
    }
    return result;
  }
}

function shortestUndirectedPath(graph, source, destinationPredicate, projection = identity) {
  const projections = [];
  let destination = undefined;
  const backpointers = new Map();
  const priority = new Map();
  const worklist = new PriorityQueue((element) => priority.get(`${[element]}`));
  priority.set(`${[undefined, source]}`, 0);
  worklist.enqueue([undefined, source]);
  let found = false;
  while (worklist.peek() !== undefined) {
    const [from, to] = worklist.dequeue();
    const prior = priority.get(`${[from, to]}`);
    if (projections.includes(projection(to))) {
      continue;
    }
    if (destinationPredicate(to)) {
      destination = to;
      backpointers.set(to, from);
      found = true;
      break;
    }
    backpointers.set(to, from);
    projections.push(projection(to));
    for (const neighbor of graph.getNeighbors(to)) {
      priority.set(`${[to, neighbor]}`, prior + graph.getEdge(to, neighbor).weight);
      worklist.enqueue([to, neighbor]);
    }
  }
  if (!found) {
    return undefined;
  }
  let result = [];
  for (let current = destination; current !== undefined; current = backpointers.get(current)) {
    result.push(current);
  }
  result = result.reverse();
  console.assert(result[0] === source, 'first assertion');
  console.assert(destinationPredicate(result[result.length - 1]) === true, 'second assertion');
  console.assert(result.every((n) => {
    if (result === undefined) {
      return true;
    }
    for (const neighbor of graph.getNeighbors(n)) {
      if (graph.getEdge(neighbor, n) === undefined) {
        return false;
      }
    }
    return true;
  }), 'third assertion');
  console.assert(result.every((n) => {
    result.every((m) => {
      if (n !== m){
        return projection(n) !== projection(m);
      }
      return true;
    });
    return true;
  }), 'fourth assertion');
  return result;
}
