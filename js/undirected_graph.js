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

  addEdge (source, edge, destination) {
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
function heuristic(cell, destination) {
  // const x = Math.abs(destination.eta - cell.eta);
  return 1;
}
function shortestUndirectedPath(graph, source, destinationPredicate, projection = identity) {
  const projections = [];
  let destination = undefined;
  const backpointers = new Map();
  const priority = new Map();
  const worklist = new PriorityQueue((element) => priority.get(`${[element]}`));
  priority.set(`${[undefined, source]}`, 0 + heuristic(source, source.destination));
  worklist.enqueue([undefined, source]);
  while (worklist.elements !== []) {
    const [from, to] = worklist.dequeue();
    const prior = priority.get(`${[from, to]}`);
    if (destinationPredicate(to)) {
      destination = to;
      backpointers.set(to, from);
      break;
    }
    if (projections.includes(projection(to))) {
      continue;
    }
    backpointers.set(to, from);
    projections.push(projection(to));
    for (const neighbor of graph.getNeighbors(to)) {
      priority.set(`${[to, neighbor]}`, prior + graph.getEdge(to, neighbor).weight);
      worklist.enqueue([to, neighbor]);
    }
  }
  const result = [];
  // console.log(backpointers);
  // console.log(destination);
  for (let current = destination; current !== undefined; current = backpointers.get(current)) {
    // console.log('this');
    result.push(current);
    // console.log(current);
  }
  // console.log(result);
  // console.log(destination);
  if (result === []) {
    return undefined;
  }
  return result.reverse();
}
// console.assert(result[0] === source);
// console.assert(destinationPredicate(result[result.length - 1]) === true);
// console.assert(result.every((n) => {
//   const index = result.indexOf(n);
//   let neighborTopIndex = 0;
//   let neighborBottomIndex = 0;
//   if (index === 0) {
//     neighborTopIndex = 1;
//     neighborBottomIndex = neighborTopIndex;
//   } else if (index === result[result.length - 1]) {
//     neighborTopIndex = result.length - 2;
//     neighborBottomIndex = neighborTopIndex;
//   } else {
//     neighborTopIndex = index + 1;
//     neighborBottomIndex = index - 1;
//   }
//   if (graph.getNeighbors(n).includes(result[neighborTopIndex]) && graph.getNeighbors(n).includes(result[neighborBottomIndex])) {
//     return false;
//   }
//   return true;
// }));
// console.assert(() => {
//   for (const val of result) {
//     for (const vul of result) {
//       if (val === vul){
//         continue;
//       } else if (val.has(projection(vul))){
//         return false;
//       }
//     }
//   }
// return true;
// });
