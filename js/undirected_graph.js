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
  const backpointers = new Map();
  const distances = new Map();
  const visited = new Set();
  let found = false;
  let destination = source;
  const worklist = new PriorityQueue((element) => distances.get(`${[element]}`));
  distances.set(`${[undefined, source]}`, -1);
  worklist.enqueue([undefined, source]);
  while (worklist.peek() !== undefined) {
    const [from, to] = worklist.dequeue();
    const distance = distances.get(`${[from, to]}`);
    distances.delete(`${[from, to]}`);
    if (backpointers.has(to)){
      continue;
    }
    backpointers.set(to, from);
    destination = to;
    if (destinationPredicate(to)) {
      destination = to;
      found = true;
      break;
    }
    for (const incidence of graph.getNeighbors(to)) {
      if (!visited.has(projection(incidence))) {
        distances.set(`${[to, incidence]}`, distance + graph.getEdge(to, incidence).weight);
        worklist.enqueue([to, incidence]);
        visited.add(projection(incidence));
      }
    }
  }
  if (found === false) {
    return undefined;
  }
  const result = [];
  for (let current = destination; current !== undefined; current = backpointers.get(current)) {
    result.push(current);
  }
  return result.reverse();
}
