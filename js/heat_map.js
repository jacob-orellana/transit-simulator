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
//   D^(0)[u][v] = …
//   D^(i)[u][v] = …    for 1 ≤ i ≤ n
//
// Recurrence for Shortest-Path Successors:
//   S^(i)[u][v] is a vertex that immediately follows u in a shortest path from u to v using only the first i vertices as intermediates, so
//   S^(n)[u][v] is a vertex that immediately follows u in a shortest path from u to v.
//
//   S^(0)[u][v] = …    if …
//                 …    otherwise
//   S^(i)[u][v] = …    if …
//                 …    if …
//                 …    otherwise    for 1 ≤ i ≤ n
function computeShortestPathSuccessors(transitGraph) {
  return undefined; // TODO: stub
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
