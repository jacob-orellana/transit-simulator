/* exported UndirectedEdge UndirectedGraph shortestUndirectedPath */
/* globals identity PriorityQueue */

class UndirectedEdge {
  constructor(weight) {
    this.weight = weight;
  }

  reverse() {
    return this;
  }
}

class UndirectedGraph {
  constructor() {
    this.vertices = [];
    this.edges = [];
    this.adjacencyMatrix = [];
  }

  addVertex(vertex) {
    this.vertices.push(vertex);
    for (const adjacencyColumn of this.adjacencyMatrix) {
      adjacencyColumn.push(undefined);
      console.assert(adjacencyColumn.length === this.vertices.length, 'Vertex count does not match adjacency matrix height.');
    }
    this.adjacencyMatrix.push(this.vertices.concat().fill(undefined));
    console.assert(this.adjacencyMatrix.length === this.vertices.length, 'Vertex count does not match adjacency matrix width.');
  }

  addEdge(source, edge, destination) {
    const sourceIndex = this.vertices.indexOf(source);
    console.assert(sourceIndex >= 0, `Edge ${edge} added to nonexistent vertex ${source}.`);
    const destinationIndex = this.vertices.indexOf(destination);
    console.assert(destinationIndex >= 0, `Edge ${edge} added to nonexistent vertex ${destination}.`);
    if (sourceIndex !== destinationIndex) {
      console.assert(this.adjacencyMatrix[sourceIndex][destinationIndex] === undefined,
        `Added edge ${edge}, which conflicts with the edge ${this.adjacencyMatrix[sourceIndex][destinationIndex]}.`);
      this.edges.push(edge);
      this.adjacencyMatrix[sourceIndex][destinationIndex] = edge;
      this.adjacencyMatrix[destinationIndex][sourceIndex] = edge.reverse();
    }
  }

  getNeighbors(vertex) {
    const vertexIndex = this.vertices.indexOf(vertex);
    console.assert(vertexIndex >= 0, `Cannot get neighbors of nonexistent vertex ${vertex}.`);
    const adjacencyColumn = this.adjacencyMatrix[vertexIndex];
    const result = [];
    for (let i = this.vertices.length; i--;) {
      if (adjacencyColumn[i] !== undefined) {
        result.push(this.vertices[i]);
      }
    }
    return result;
  }

  getEdge(source, destination) {
    const sourceIndex = this.vertices.indexOf(source);
    console.assert(sourceIndex >= 0, `Cannot get edge incident on nonexistent vertex ${source}.`);
    const destinationIndex = this.vertices.indexOf(destination);
    console.assert(destinationIndex >= 0, `Cannot get edge incident on nonexistent vertex ${destination}.`);
    return this.adjacencyMatrix[sourceIndex][destinationIndex];
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
