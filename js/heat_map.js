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
// function computeShortestPathSuccessors(transitGraph) {
//  const result = new EdgeLabeledGraph(transitGraph.edges);
//  const beginning = result.edges.keys()[0];
//  for (const [source, adjacencies] of result.edges){
//    for (const [destination, label] of adjacencies) {
//      if (label !== undefined) {
//        if (source === beginning) {
//          result.setLabel(source, destination, destination);
//        } else {
//          result.setLabel(source, destination, beginning);
//        }
//      }
//    }
//  }
//  return result;
// }

function computeShortestPathSuccessors(transitGraph) {
  for (transitGraph.edges)
  const result = new EdgeLabeledGraph(vertices);
  for (const [source, adjacencies] of result.edges) {
    let minimum = Infinity;
    for (const [destination, label] of adjacencies) {
      if (label !== undefined) {
        if (label < minimum) {
          minimum = label;
          result.setLabel(source, destination, destination);
        }
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
