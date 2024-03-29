QUnit.module('undirected_graph.js');
/* globals QUnit UndirectedEdge UndirectedGraph shortestUndirectedPath Vertex */
/* eslint-disable no-magic-numbers */

// CATEGORY-PARTITION METHOD
/*
  - the list of verticies could be empty or contain verticies
  - the list of edges could be empty or contain edges
*/

// testing a vertex that has no neighbors
QUnit.test('find the nonexistent neighbors of a vertex', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  // test whether the lists have no contents
  assert.deepEqual(graph.vertices.length, 0);
  assert.deepEqual(graph.edges.length, 0);
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(b, new UndirectedEdge(7), c);
  assert.deepEqual(graph.getNeighbors(a), []);
  // test whether the lists have contents
  assert.deepEqual(graph.vertices.length, 3);
  assert.deepEqual(graph.edges.length, 1);
});

// testing a vertex that has neighbors
QUnit.test('find the neighbors of a vertex', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(8), c);
  assert.deepEqual(graph.getNeighbors(a), [b, c]);
});

// Test if the class method getNeighbors return all getNeighbors
// that aren't connected
QUnit.test('find the nonconnected neighbors of a vertex', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addVertex(d);
  graph.addEdge(a, new UndirectedEdge(3), b);
  graph.addEdge(a, new UndirectedEdge(5), d);
  graph.addEdge(a, new UndirectedEdge(4), c);
  assert.deepEqual(graph.getNeighbors(a).sort(), [b, c, d]);
});

// testing a self edge
QUnit.test('retrieve a nonexistent self edge', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), a);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(8), c);
  // test the length of the edges
  assert.deepEqual(graph.edges.length, 2);
  assert.deepEqual(graph.getEdge(a, a), undefined);
});

// testing edges that don't exist
QUnit.test('retrieve a nonexistent edge given two vertices', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(8), c);
  assert.deepEqual(graph.getEdge(a, b), undefined);
  assert.deepEqual(graph.getEdge(b, a), undefined);
});

// Testing if the class method getEdge returns undefined
// when a self edge was created
QUnit.test('retrieve an existent self edge as undefined', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(2), a);
  assert.deepEqual(graph.getEdge(a, a, undefined));
});

// testing an edge that does exist
QUnit.test('retrieve an edge given two vertices', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  const edge = new UndirectedEdge(2);
  const edgeTwo = new UndirectedEdge(7);
  graph.addEdge(a, edge, b);
  graph.addEdge(b, edgeTwo, c);
  graph.addEdge(a, new UndirectedEdge(8), c);
  assert.deepEqual(graph.getEdge(a, b), edge);
  assert.deepEqual(graph.getEdge(b, a), edge);
  assert.deepEqual(graph.getEdge(b, c), edgeTwo);
});

QUnit.test('find a path from a vertex to itself', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(8), c);
  assert.deepEqual(shortestUndirectedPath(graph, a, (vertex) => vertex === a), [a]);
});

QUnit.test('find a path from a vertex to a neighbor with no shortcuts available', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(8), c);
  assert.deepEqual(shortestUndirectedPath(graph, a, (vertex) => vertex === c), [a, c]);
});

QUnit.test('find a path from a vertex to a neighbor with a shortcut available', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(10), c);
  assert.deepEqual(shortestUndirectedPath(graph, a, (vertex) => vertex === c), [a, b, c]);
});

QUnit.test('find a nonexistent path', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(b, new UndirectedEdge(7), c);
  assert.deepEqual(shortestUndirectedPath(graph, a, (vertex) => vertex === c), undefined);
});

QUnit.test('finding a path from the last vertex with a shortcut available', (assert) => {
  const graph = new UndirectedGraph();
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(10), c);
  assert.deepEqual(shortestUndirectedPath(graph, c, (vertex) => vertex === c), [c]);
});

/* The following weighted test cases test finding the shortest path to a vertex when projections exist of that vertex */

QUnit.test('first weighted graph test case for projections', (assert) => {
  const graph = new UndirectedGraph();
  const s = new Vertex('s');
  const t = new Vertex('t');
  const tp = new Vertex('t\'');
  graph.addVertex(s);
  graph.addVertex(t);
  graph.addVertex(tp);
  graph.addEdge(s, new UndirectedEdge(5), tp);
  graph.addEdge(s, new UndirectedEdge(1), t);
  assert.deepEqual(shortestUndirectedPath(graph, s, (vertex) => vertex === t), [s, t]);
});

QUnit.test('second weighted graph test case for projections', (assert) => {
  const graph = new UndirectedGraph();
  const s = new Vertex('s');
  const t = new Vertex('t');
  const tp = new Vertex('t\'');
  graph.addVertex(s);
  graph.addVertex(t);
  graph.addVertex(tp);
  graph.addEdge(s, new UndirectedEdge(1), tp);
  graph.addEdge(s, new UndirectedEdge(2), t);
  assert.deepEqual(shortestUndirectedPath(graph, s, (vertex) => vertex === t, (vertex) => vertex === tp || vertex === t), undefined);
});

QUnit.test('third weighted graph test case for projections', (assert) => {
  const graph = new UndirectedGraph();
  const s = new Vertex('s');
  const t = new Vertex('t');
  const tp = new Vertex('t\'');
  const c = new Vertex('c');
  graph.addVertex(s);
  graph.addVertex(t);
  graph.addVertex(tp);
  graph.addVertex(c);
  graph.addEdge(c, new UndirectedEdge(1), tp);
  graph.addEdge(c, new UndirectedEdge(2), t);
  graph.addEdge(s, new UndirectedEdge(1), c);
  assert.deepEqual(shortestUndirectedPath(graph, s, (vertex) => vertex === t, (vertex) => vertex === tp), undefined);
});

QUnit.test('fourth weighted graph test case for projections', (assert) => {
  const graph = new UndirectedGraph();
  const s = new Vertex('s');
  const t = new Vertex('t');
  const u = new Vertex('u');
  const up = new Vertex('u\'');
  graph.addVertex(s);
  graph.addVertex(t);
  graph.addVertex(u);
  graph.addVertex(up);
  graph.addEdge(s, new UndirectedEdge(1), u);
  graph.addEdge(s, new UndirectedEdge(2), up);
  graph.addEdge(up, new UndirectedEdge(2), t);
  assert.deepEqual(shortestUndirectedPath(graph, s, (vertex) => vertex === t, (vertex) => vertex === up), undefined);
});

QUnit.test('fifth weighted graph test case for projections', (assert) => {
  const graph = new UndirectedGraph();
  const s = new Vertex('s');
  const t = new Vertex('t');
  const u = new Vertex('u');
  const tp = new Vertex('t\'');
  graph.addVertex(s);
  graph.addVertex(t);
  graph.addVertex(u);
  graph.addVertex(tp);
  graph.addEdge(s, new UndirectedEdge(1), u);
  graph.addEdge(u, new UndirectedEdge(2), tp);
  graph.addEdge(s, new UndirectedEdge(4), t);
  assert.deepEqual(shortestUndirectedPath(graph, s, (vertex) => vertex === t, (vertex) => vertex === tp), undefined);
});

QUnit.test('sixth weighted graph test case for projections', (assert) => {
  const graph = new UndirectedGraph();
  const s = new Vertex('s');
  const t = new Vertex('t');
  const tp = new Vertex('t\'');
  const c = new Vertex('c');
  const b = new Vertex('b');
  graph.addVertex(s);
  graph.addVertex(t);
  graph.addVertex(tp);
  graph.addVertex(c);
  graph.addVertex(b);
  graph.addEdge(s, new UndirectedEdge(1), c);
  graph.addEdge(s, new UndirectedEdge(4), b);
  graph.addEdge(c, new UndirectedEdge(2), tp);
  graph.addEdge(b, new UndirectedEdge(2), t);
  assert.deepEqual(shortestUndirectedPath(graph, s, (vertex) => vertex === t, (vertex) => vertex === tp), undefined);
});

QUnit.test('seventh weighted graph test case for projections', (assert) => {
  const graph = new UndirectedGraph();
  const s = new Vertex('s');
  const t = new Vertex('t');
  const c = new Vertex('c');
  const u = new Vertex('u');
  const up = new Vertex('u\'');
  graph.addVertex(s);
  graph.addVertex(t);
  graph.addVertex(c);
  graph.addVertex(u);
  graph.addVertex(up);
  graph.addEdge(c, new UndirectedEdge(2), u);
  graph.addEdge(s, new UndirectedEdge(1), c);
  graph.addEdge(s, new UndirectedEdge(4), up);
  graph.addEdge(up, new UndirectedEdge(2), t);
  assert.deepEqual(shortestUndirectedPath(graph, s, (vertex) => vertex === t, (vertex) => vertex === up), undefined);
});
