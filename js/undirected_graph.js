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
    this.hashGraph.set(vertex, new HashTable(this.hashGraph._hashFunction));
    this.vertices.push(vertex);
  }

  addEdge(source, edge, destination) {
    console.assert(this.vertices.includes(source), 'Vertex does not exist in the graph.');
    console.assert(this.vertices.includes(destination), 'Vertex does not exist in the graph.');
    if (source !== destination){
      this.hashGraph.get(source).set(destination, edge);
      this.hashGraph.get(destination).set(source, edge.reverse());
      this.edges.push(edge);
    }
  }

  getNeighbors(vertex) {
    return this.hashGraph.get(vertex).keys;
  }

  getEdge(source, destination) {
    return this.hashGraph.get(source).get(destination);
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
