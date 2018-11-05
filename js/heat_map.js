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
  const transitGraph = new EdgeLabeledGraph(city.walkGraph.vertices, '');
  for (const vertexOne of transitGraph.vertices) {
    for (const vertexTwo of transitGraph.vertices){
      if (vertexOne !== vertexTwo) {
        const walkCandidate = city.walkGraph.getEdge(vertexOne, vertexTwo);
        const driveCandidate = city.driveGraph.getEdge(vertexOne, vertexTwo);
        if (walkCandidate !== undefined && driveCandidate !== undefined){
          if (walkCandidate.weight > driveCandidate.weight * 2) {
            transitGraph.setLabel(vertexOne, vertexTwo, driveCandidate.weight * 2);
          } else {
            transitGraph.setLabel(vertexOne, vertexTwo, walkCandidate.weight);
          }
        } else if (walkCandidate === undefined && driveCandidate !== undefined) {
          transitGraph.setLabel(vertexOne, vertexTwo, driveCandidate.weight * 2);
        } else if (walkCandidate !== undefined && driveCandidate === undefined) {
          transitGraph.setLabel(vertexOne, vertexTwo, walkCandidate.weight);
        } else {
          transitGraph.setLabel(vertexOne, vertexTwo, Infinity);
        }
      } else {
        transitGraph.setLabel(vertexOne, vertexTwo, Infinity);
      }
    }
  }
  for (const i of transitGraph.vertices){
    for (const j of transitGraph.vertices){
      if (i !== j) {
        for (const k of transitGraph.vertices){
          if (transitGraph.getLabel(i, k) !== Infinity && Infinity !== transitGraph.getLabel(k, j)) {
            const candidate = transitGraph.getLabel(i, k) + transitGraph.getLabel(k, j);
            if (transitGraph.getLabel(i, j) > candidate){
              transitGraph.setLabel(i, j, candidate);
            }
          }
        }
      }
    }
  }
  return transitGraph;
}

// function computeTransitGraph(city) {
//   const transitGraph = new EdgeLabeledGraph(city.walkGraph.vertices, 'Infinity');
//   for (const source of transitGraph.vertices) {
//     for (const destination of transitGraph.vertices) {
//       if (city.driveGraph.getNeighbors(source).includes(destination) && city.walkGraph.getNeighbors(source).includes(destination)) {
//         if (city.driveGraph.getEdge(source, destination).weight < city.walkGraph.getEdge(source, destination).weight) {
//           transitGraph.setLabel(source, destination, city.driveGraph.getEdge(source, destination).weight * 2);
//         } else {
//           transitGraph.setLabel(source, destination, city.walkGraph.getEdge(source, destination).weight);
//         }
//       } else if (city.walkGraph.getNeighbors(source).includes(destination)) {
//         transitGraph.setLabel(source, destination, city.walkGraph.getEdge(source, destination).weight);
//       } else if (city.driveGraph.getNeighbors(source).includes(destination)){
//         transitGraph.setLabel(source, destination, city.driveGraph.getEdge(source, destination).weight);
//       }
//     }
//   }
//   return transitGraph;
// }

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
  for (const vertex of transitGraph.vertices){
    additive.push(vertex);
  }
  const graph = new EdgeLabeledGraph(additive, undefined);
  const result = new EdgeLabeledGraph(additive, undefined);
  for (const vertexOne of transitGraph.vertices) {
    for (const vertexTwo of transitGraph.vertices){
      if (transitGraph.getLabel(vertexOne, vertexTwo) === Infinity){
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
      let kLoops = 1; // Can be taken out to find shortest path in general. Currently stops the algorithm at k = 1 since the specification calls for k = 1.
      for (const k of transitGraph.vertices){
        if (kLoops === 1) {
          const candidate = graph.getLabel(i, k) + graph.getLabel(k, j);
          if (candidate === '' && graph.getLabel(i, j) === ''){
            result.setLabel(i, j, '');
          } else if (graph.getLabel(i, j) > candidate){
            graph.setLabel(i, j, candidate);
            result.setLabel(i, j, k);
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
  const additive = [];
  for (const vertex of successors.vertices){
    additive.push(vertex);
  }
  const graph = new EdgeLabeledGraph(additive, 0);
  const collection = [];
  for (const source of successors.vertices){
    for (const destination of successors.vertices){
      const label = successors.getLabel(source, destination);
      collection.push([source, destination, label]);
    }
  }
  for (const source of successors.vertices) {
    graph.increaseLabel(source, source, 1);
    for (const destination of successors.vertices){
      for (const values of collection) {
        if (values[1] === destination) {
          if (values[0] === source || source === values[2]) {
            graph.increaseLabel(source, destination, 1);
            graph.capLabel(source, destination, additive.length);
          }
        }
      }
    }
  }
  return graph;
}

function computeHeatFromTraffic(traffic) {
  const result = new Map();
  for (const source of traffic.vertices){
    let additive = 0;
    for (const dest of traffic.vertices){
      additive += traffic.getLabel(source, dest);
    }
    result.set(source, additive);
  }
  return result;
}

function computeHeatMap(city) {
  return undefined; // TODO: stub
}
