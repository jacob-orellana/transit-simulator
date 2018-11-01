QUnit.module('heat_map.js');
/* globals QUnit Vertex UndirectedEdge UndirectedGraph City Route Bus EdgeLabeledGraph */
/* globals computeTransitGraph computeShortestPathSuccessors computeTrafficMatrix computeHeatFromTraffic computeHeatMap */
/* eslint-disable no-magic-numbers */

// This reformatting is not necessary, but makes the output from failed tests easier to read.
function toTriples(edgeLabeledGraph) {
  const accumulator = [];
  for (const [source, adjacencies] of edgeLabeledGraph.edges) {
    for (const [destination, label] of adjacencies) {
      accumulator.push([source, destination, label]);
    }
  }
  let result = '';
  for (const triple of accumulator.sort()) {
    result += `(${triple}); `;
  }
  return result.slice(0, -2);
}

// Building graphs from strings is not necessary, but makes tests easier to write.
function fromTriples(triplesString) {
  const triples = triplesString.split('; ').map((triple) => triple.slice(1, -1).split(','));
  const vertices = new Set();
  for (const [source, destination, _] of triples) {
    vertices.add(source);
    vertices.add(destination);
  }
  const result = new EdgeLabeledGraph(vertices, undefined);
  for (const [source, destination, label] of triples) {
    let cast = Number(label);
    if (label === '') {
      cast = undefined;
    } else if (Number.isNaN(cast)){
      cast = label;
    }
    result.setLabel(source, destination, cast);
  }
  return result;
}

const CITY_FOR_SMOKE_TESTS = (() => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(2.0), b);
  walkGraph.addEdge(a, new UndirectedEdge(4.0), c);
  walkGraph.addEdge(b, new UndirectedEdge(8.0), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, c);
  const x = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  const y = new Bus(route.getArc(c)); // eslint-disable-line no-unused-vars
  return city;
})();

const CITY_MAXIMUM_OF_TWO = (() => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addEdge(a, new UndirectedEdge(2.0), b);
  walkGraph.addEdge(a, new UndirectedEdge(4.0), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addEdge(c, new UndirectedEdge(1.0), d);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, c, d);
  const x = new Bus(route.getArc(c)); // eslint-disable-line no-unused-vars
  return city;
})();

const MAX_DEGREE_FOUR_CITY = (() => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(2.0), b);
  walkGraph.addEdge(a, new UndirectedEdge(4.0), c);
  walkGraph.addEdge(b, new UndirectedEdge(8.0), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(1.0), c);
  driveGraph.addEdge(a, new UndirectedEdge(1.0), b);
  driveGraph.addEdge(b, new UndirectedEdge(1.0), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, c);
  const x = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  const y = new Bus(route.getArc(c)); // eslint-disable-line no-unused-vars
  return city;
})();

const INFINITE_STEPS_CITY = (() => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(1.0), b);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, c);
  const x = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  const y = new Bus(route.getArc(c)); // eslint-disable-line no-unused-vars
  return city;
})();

QUnit.test('smoke test computeTransitGraph', (assert) => {
  const transitGraph = computeTransitGraph(CITY_FOR_SMOKE_TESTS);
  assert.deepEqual(toTriples(transitGraph), '(a,a,Infinity); (a,b,2); (a,c,2); (b,a,2); (b,b,Infinity); (b,c,8); (c,a,2); (c,b,8); (c,c,Infinity)');
});

QUnit.test('maximum of two test computeTransitGraph', (assert) => {
  const transitGraph = computeTransitGraph(CITY_MAXIMUM_OF_TWO);
  assert.deepEqual(toTriples(transitGraph), '(a,a,Infinity); (a,b,2); (a,c,4); (b,a,2); (b,b,Infinity); (b,c,8); (c,a,4); (c,b,8); (c,c,Infinity)');
});

QUnit.test('maximum of four test computeTransitGraph', (assert) => {
  const transitGraph = computeTransitGraph(MAX_DEGREE_FOUR_CITY);
  assert.deepEqual(toTriples(transitGraph), '(a,a,Infinity); (a,b,2); (a,c,2); (b,a,2); (b,b,Infinity); (b,c,2); (c,a,2); (c,b,2); (c,c,Infinity)');
});

QUnit.test('infinite steps test computeTransitGraph', (assert) => {
  const transitGraph = computeTransitGraph(INFINITE_STEPS_CITY);
  assert.deepEqual(toTriples(transitGraph), '(a,a,Infinity); (a,b,1); (a,c,Infinity); (b,a,1); (b,b,Infinity); (b,c,Infinity); (c,a,Infinity); (c,b,Infinity); (c,c,Infinity)');
});

QUnit.test('smoke test computeShortestPathSuccessors', (assert) => {
  const transitGraph = fromTriples('(a,a,Infinity); (a,b,2); (a,c,2); (b,a,2); (b,b,Infinity); (b,c,8); (c,a,2); (c,b,8); (c,c,Infinity)');
  const successors = computeShortestPathSuccessors(transitGraph);
  assert.deepEqual(toTriples(successors), '(a,a,); (a,b,b); (a,c,c); (b,a,a); (b,b,); (b,c,a); (c,a,a); (c,b,a); (c,c,)');
});

QUnit.test('maximum of two test computeShortestPathSuccessors', (assert) => { // TO DO
  const transitGraph = fromTriples('(a,a,Infinity); (a,b,2); (a,c,4); (a,d,6); (b,a,2); (b,b,Infinity); (b,c,6); (b,d,8); (c,a,4); (c,b,6); (c,d,2); (d,a,6); (d,b,8); (d,c,2); (d,d,Infinity)');
  const successors = computeShortestPathSuccessors(transitGraph);
  assert.deepEqual(toTriples(successors), '(a,a,); (a,b,b); (a,c,c); (a,d,c); (b,a,a); (b,b,); (b,c,a); (b,d,a); (c,a,a); (c,b,a); (c,d,d); (d,a,c); (d,b,c); (d,c,c); (d,d,)');
});

QUnit.test('degree four test computeShortestPathSuccessors', (assert) => { // TO DO
  const transitGraph = fromTriples('(a,a,Infinity); (a,b,2); (a,c,2); (b,a,2); (b,b,Infinity); (b,c,2); (c,a,2); (c,b,2); (c,c,Infinity)');
  const successors = computeShortestPathSuccessors(transitGraph);
  assert.deepEqual(toTriples(successors), '(a,a,); (a,b,b); (a,c,c); (b,a,a); (b,b,); (b,c,c); (c,a,a); (c,b,b); (c,c,)');
});

QUnit.test('infinite steps test computeShortestPathSuccessors', (assert) => { // TO DO
  const transitGraph = fromTriples('(a,a,Infinity); (a,b,1); (a,c,Infinity); (b,a,1); (b,b,Infinity); (b,c,Infinity); (c,a,Infinity); (c,b,Infinity); (c,c,Infinity)');
  const successors = computeShortestPathSuccessors(transitGraph);
  assert.deepEqual(toTriples(successors), '(a,a,); (a,b,b); (a,c,); (b,a,a); (b,b,); (b,c,); (c,a,); (c,b,); (c,c,)');
});

QUnit.test('smoke test computeTrafficMatrix', (assert) => {
  const successors = fromTriples('(a,a,); (a,b,b); (a,c,c); (b,a,a); (b,b,); (b,c,a); (c,a,a); (c,b,a); (c,c,)');
  const traffic = computeTrafficMatrix(successors);
  assert.deepEqual(toTriples(traffic), '(a,a,3); (a,b,2); (a,c,2); (b,a,1); (b,b,3); (b,c,1); (c,a,1); (c,b,1); (c,c,3)');
});

QUnit.test('smoke test computeHeatFromTraffic', (assert) => {
  const traffic = fromTriples('(a,a,3); (a,b,2); (a,c,2); (b,a,1); (b,b,3); (b,c,1); (c,a,1); (c,b,1); (c,c,3)');
  const heat = computeHeatFromTraffic(traffic);
  assert.deepEqual(heat.size, 3);
  assert.deepEqual(heat.get('a'), 7); // fromTriples will give us string keys, not vertex keys
  assert.deepEqual(heat.get('b'), 5);
  assert.deepEqual(heat.get('c'), 5);
});

QUnit.test('smoke test computeHeatMap', (assert) => {
  const a = CITY_FOR_SMOKE_TESTS.walkGraph.vertices.find((vertex) => vertex.name === 'a');
  const b = CITY_FOR_SMOKE_TESTS.walkGraph.vertices.find((vertex) => vertex.name === 'b');
  const c = CITY_FOR_SMOKE_TESTS.walkGraph.vertices.find((vertex) => vertex.name === 'c');
  const heat = computeHeatMap(CITY_FOR_SMOKE_TESTS);
  assert.deepEqual(heat.size, 3);
  assert.deepEqual(heat.get(a), 7);
  assert.deepEqual(heat.get(b), 5);
  assert.deepEqual(heat.get(c), 5);
});
