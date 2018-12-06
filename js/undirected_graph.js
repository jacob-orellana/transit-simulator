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
  constructor() {
    this.hashGraph = new HashTable((index) => hashFunction(index));
    this.vertices = [];
    this.edges = [];
  }

  addVertex(vertex) {
    console.assert(!this.vertices.includes(vertex), 'Vertex already exists in the graph.');
    this.hashGraph.set(vertex);
    this.vertices.push(vertex);
    // this.vertices.push(vertex);
    // for (const adjacencyColumn of this.adjacencyMatrix) {
    //   adjacencyColumn.push(undefined);
    //   console.assert(adjacencyColumn.length === this.vertices.length, 'Vertex count does not match adjacency matrix height.');
    // }
    // this.adjacencyMatrix.push(this.vertices.concat().fill(undefined));
    // console.assert(this.adjacencyMatrix.length === this.vertices.length, 'Vertex count does not match adjacency matrix width.');
  }

  addEdge(source, edge, destination) {
    const sourceBucket = this.hashGraph._buckets[this.hashGraph._hashFunction(source)];
    const destinationBucket = this.hashGraph._buckets[this.hashGraph._hashFunction(destination)];
    // console.assert(sourceBucket.exists, 'Graph does not have that vertex source.');
    // console.assert(destinationBucket[0][0].name === destination, 'Graph does not have that vertex destination.');
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
    // const sourceIndex = this.vertices.indexOf(source);
    // console.assert(sourceIndex >= 0, `Edge ${edge} added to nonexistent vertex ${source}.`);
    // const destinationIndex = this.vertices.indexOf(destination);
    // console.assert(destinationIndex >= 0, `Edge ${edge} added to nonexistent vertex ${destination}.`);
    // if (sourceIndex !== destinationIndex) {
    //   console.assert(this.adjacencyMatrix[sourceIndex][destinationIndex] === undefined,
    //     `Added edge ${edge}, which conflicts with the edge ${this.adjacencyMatrix[sourceIndex][destinationIndex]}.`);
    //   this.edges.push(edge);
    //   this.adjacencyMatrix[sourceIndex][destinationIndex] = edge;
    //   this.adjacencyMatrix[destinationIndex][sourceIndex] = edge.reverse();
    // }
  }

  getNeighbors(vertex) {
    const bucket = this.hashGraph._buckets[this.hashGraph._hashFunction(vertex)][0];
    // console.assert(bucket[0][0] === vertex, 'Graph does not have that vertex.');
    const result = [];
    for (const entry of bucket) {
      if (typeof entry === 'object'){
        const neighbor = Object.entries(entry)[0][0];
        if (this.vertices.includes(neighbor)){
          result.push(neighbor);
        }
      }
    }
    return result;
    // const vertexIndex = this.vertices.indexOf(vertex);
    // console.assert(vertexIndex >= 0, `Cannot get neighbors of nonexistent vertex ${vertex}.`);
    // const adjacencyColumn = this.adjacencyMatrix[vertexIndex];
    // const result = [];
    // for (let i = this.vertices.length; i--;) {
    //   if (adjacencyColumn[i] !== undefined) {
    //     result.push(this.vertices[i]);
    //   }
    // }
    // return result;
  }

  getEdge(source, destination) {
    const bucket = this.hashGraph._buckets[this.hashGraph._hashFunction(source)][0];
    // console.assert(bucket[0][0].name === source, 'Graph does not have that vertex source.');
    // console.assert(this.hashGraph.keys.includes(destination), 'Graph does not have that vertex destination.');
    let result = undefined;
    if (bucket[1] !== undefined){
      let vertex = '';
      for (let i = 1; i < bucket.length; ++i){
        vertex = bucket[i];
        if (destination === Object.entries(vertex)[0][0]){
          result = Object.entries(vertex)[0][1];
        }
      }
    }
    return result;
    // const sourceIndex = this.vertices.indexOf(source);
    // console.assert(sourceIndex >= 0, `Cannot get edge incident on nonexistent vertex ${source}.`);
    // const destinationIndex = this.vertices.indexOf(destination);
    // console.assert(destinationIndex >= 0, `Cannot get edge incident on nonexistent vertex ${destination}.`);
    // return this.adjacencyMatrix[sourceIndex][destinationIndex];
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
