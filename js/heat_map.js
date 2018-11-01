/* exported computeHeatMap */

class EdgeLabeledGraph {
  constructor(vertices, defaultLabel) {
    const verticesList = [...vertices]; // copy the vertices to a list in case they can only be iterated over once
    this.edges = new Map();
    for (const source of verticesList) {
      const adjacencies = new Map();
      for (const destination of verticesList) {
        adjacencies.set(destination, defaultLabel);
      }
      this.edges.set(source, adjacencies);
    }
  }

  get vertices() {
    return this.edges.keys();
  }

  getLabel(source, destination) {
    return this.edges.get(source).get(destination);
  }

  setLabel(source, destination, label) {
    return this.edges.get(source).set(destination, label);
  }

  capLabel(source, destination, label) {
    const adjacencies = this.edges.get(source);
    adjacencies.set(destination, Math.min(adjacencies.get(destination), label));
  }

  increaseLabel(source, destination, increase) {
    const adjacencies = this.edges.get(source);
    adjacencies.set(destination, adjacencies.get(destination) + increase);
  }
}

function computeTransitGraph(city) {
  const transitGraph = new EdgeLabeledGraph(city.walkGraph.vertices, 'Infinity');
  // for (const vertex1 of city.driveGraph.vertices){
  //   if (!transitGraph.vertices.includes(vertex1)){
  //     transitGraph.vertices.push(vertex1);
  //   }
  // }
  for (const vertex of transitGraph.vertices) {
    for (const neighbor of city.walkGraph.getNeighbors(vertex)){
      const walkEdge = city.walkGraph.getEdge(vertex, neighbor);
      if (city.driveGraph.getNeighbors(vertex).includes(neighbor)) {
        const driveEdge = city.driveGraph.getEdge(vertex, neighbor);
        if (driveEdge.weight < walkEdge.weight){
          transitGraph.setLabel(vertex, neighbor, driveEdge.weight);
        }
      } else {
        transitGraph.setLabel(vertex, neighbor, walkEdge.weight);
      }
    }
  }
  return transitGraph;
}

// Preliminaries:
//   W[u][v] is the (possibly infinite) weight from u to v.
//
// Standard Floyd–Warshall Recurrence:
//   D^(i)[u][v] is the distance from u to v using only the first i vertices as intermediates, so
//   D^(n)[u][v] is the distance from u to v.
//
//   D^(0)[u][v] = W[u][v]
//   D^(i)[u][v] = min(D(i - 1)[u, v], D(i - 1)[u][i -1] + D(i - 1)[i - 1][v])    for 1 ≤ i ≤ n
//
// Recurrence for Shortest-Path Successors:
//   S^(i)[u][v] is a vertex that immediately follows u in a shortest path from u to v using only the
//                 first i vertices as intermediates, so
//   S^(n)[u][v] is a vertex that immediately follows u in a shortest path from u to v.
//
//   S^(0)[u][v] =  undefined    if no path u to v
//                  v    otherwise
//   S^(i)[u][v] =  undefined    if no path u to v
//                 v    if D^(i)[u][v] = D(i - 1)[u , v]
//                 i -1    otherwise    for 1 ≤ i ≤ n

function computeShortestPathSuccessors(transitGraph) {
  const additive = [];
  const size = transitGraph.vertices.size;
  for (const vertex of transitGraph.vertices){
    additive.push(vertex);
  }
  for (let k = 0; k < size; ++k){
    const candidate = [];
    for (let l = 0; l < size; ++l){
      candidate.push(undefined);
    }
  }
  const graph = new EdgeLabeledGraph(additive, undefined);
  const result = new EdgeLabeledGraph(additive, undefined);
  for (const vertexOne of transitGraph.vertices) {
    for (const vertexTwo of transitGraph.vertices){
      if (vertexOne === vertexTwo){
        graph.setLabel(vertexOne, vertexTwo, '');
        result.setLabel(vertexOne, vertexTwo, '');
      } else {
        graph.setLabel(vertexOne, vertexTwo, transitGraph.getLabel(vertexOne, vertexTwo));
        result.setLabel(vertexOne, vertexTwo, vertexTwo);
      }
    }
  }
  for (const i of transitGraph.vertices){
    for (const j of transitGraph.vertices){
      let kLoops = 1;
      for (const k of transitGraph.vertices){
        if (kLoops === 1) {
          const candidate = graph.getLabel(i, k) + graph.getLabel(k, j);
          if (graph.getLabel(i, j) > candidate){
            graph.setLabel(i, j, candidate);
            result.setLabel(i, j, k);
          } else if (i !== j) {
            result.setLabel(i, j, j);
          }
        }
        ++kLoops;
      }
    }
  }
  return result;
}

// Preliminaries:
//   S^(n)[u][v] is defined as above computeShortestPathSuccessors.
//
// Recurrence for Traffic Matrix:
//   T^(i)[u][v] is the number of distinct paths that visit a vertex \(u\) in their first \(i\) steps while traveling to a final destination \(v\), so
//   T^(n-1)[u][v] is the number of distinct paths that travel via \(u\) to their final destination \(v\).
//
//   T^(0)[u][v] = 1
//   T^(i)[u][v] = 1 + sum_{w|S^(n)[w][v]=u} T^(i-1)[w][v]    for 1 ≤ i ≤ n
//
function computeTrafficMatrix(successors) {
  return undefined; // TODO: stub
}

function computeHeatFromTraffic(traffic) {
  return undefined; // TODO: stub
}

function computeHeatMap(city) {
  return undefined; // TODO: stub
}
