QUnit.module('transit.js');
/* globals QUnit Vertex UndirectedEdge UndirectedGraph SimulationEvent City Route Bus Passenger */
/* eslint-disable no-magic-numbers, no-underscore-dangle */

function waypoints(route) {
  const result = [];
  for (const waypoint of route.waypoints) {
    result.push(waypoint[1].vertex);
  }
  return result.sort();
}

function arcs(route) {
  const result = [];
  for (const arc of route.arcs) {
    result.push(`${arc.source !== undefined ? arc.source.vertex : ''}→${arc.destination.vertex}`);
  }
  return result.sort();
}

QUnit.test('create two-waypoint route', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  const city = new City(graph, graph);
  const route = new Route(city, a, b);
  assert.deepEqual(waypoints(route), [a, b]);
  assert.deepEqual(arcs(route), ['a→b', 'b→a']);
});

QUnit.test('patch route to add waypoint', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  assert.deepEqual(waypoints(route), [a, b, c]);
  assert.deepEqual(arcs(route), ['a→b', 'b→c', 'c→a']);
});

QUnit.test('patch route to remove waypoint', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  route.patch(a, c);
  assert.deepEqual(waypoints(route), [a, c]);
  assert.deepEqual(arcs(route), ['a→c', 'c→a']);
});

QUnit.test('patch route to remove waypoint with bus still on far arc', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  route.patch(a, c);
  assert.deepEqual(waypoints(route), [a, b, c]);
  assert.deepEqual(arcs(route), ['→b', 'b→c', 'c→a', 'a→c'].sort());
});

QUnit.test('patch route to remove waypoint with bus still on near arc', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(b)); // eslint-disable-line no-unused-vars
  route.patch(a, c);
  assert.deepEqual(waypoints(route), [a, c]);
  assert.deepEqual(arcs(route), ['→c', 'c→a', 'a→c'].sort());
});

QUnit.test('patch route to reverse orientation', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  route.patch(a, c);
  route.patch(c, b, a);
  assert.deepEqual(waypoints(route), [a, b, c]);
  assert.deepEqual(arcs(route), ['a→c', 'c→b', 'b→a'].sort());
});

QUnit.test('patch route to reverse orientation with bus still on far arc', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  route.patch(a, c);
  route.patch(c, b, a);
  assert.deepEqual(waypoints(route), [a, b, c]);
  assert.deepEqual(arcs(route), ['→b', 'b→a', 'a→c', 'c→b'].sort());
});

QUnit.test('patch route to reverse orientation with bus still on near arc', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(b)); // eslint-disable-line no-unused-vars
  route.patch(a, c);
  route.patch(c, b, a);
  assert.deepEqual(waypoints(route), [a, b, c]);
  assert.deepEqual(arcs(route), ['→c', 'c→b', 'b→a', 'a→c'].sort());
});

QUnit.test('distinguish vertices in and out of a route\'s core', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addVertex(d);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(c, new UndirectedEdge(1.0), d);
  graph.addEdge(a, new UndirectedEdge(1.0), d);
  const city = new City(graph, graph);
  const route = new Route(city, a, d);
  route.patch(a, b, c, d);
  const x = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  route.patch(a, d);
  assert.deepEqual(route.hasInCore(a), true);
  assert.deepEqual(route.hasInCore(b), false);
  assert.deepEqual(route.hasInCore(c), false);
  assert.deepEqual(route.hasInCore(d), true);
});

QUnit.test('advance bus to remove moribund arc', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  route.patch(a, c);
  x._arrive();
  assert.deepEqual(waypoints(route), [a, c]);
  assert.deepEqual(arcs(route), ['→c', 'c→a', 'a→c'].sort());
});

QUnit.test('advance first of two buses without removing moribund arc', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addVertex(d);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(c, new UndirectedEdge(1.0), d);
  graph.addEdge(a, new UndirectedEdge(1.0), d);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, d);
  route.patch(a, b, c, d);
  const x = new Bus(route.getArc(b)); // eslint-disable-line no-unused-vars
  route.patch(a, c);
  const y = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  route.patch(a, d);
  assert.deepEqual(waypoints(route), [a, c, d]);
  assert.deepEqual(arcs(route), ['→c', '→c', 'c→d', 'd→a', 'a→d'].sort());
  x._arrive();
  assert.deepEqual(waypoints(route), [a, c, d]);
  assert.deepEqual(arcs(route), ['→c', 'c→d', 'd→a', 'a→d'].sort());
});

QUnit.test('advance second of two buses without removing moribund arc', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addVertex(d);
  graph.addEdge(a, new UndirectedEdge(1.0), b);
  graph.addEdge(b, new UndirectedEdge(1.0), c);
  graph.addEdge(c, new UndirectedEdge(1.0), d);
  graph.addEdge(a, new UndirectedEdge(1.0), d);
  graph.addEdge(a, new UndirectedEdge(1.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, d);
  route.patch(a, b, c, d);
  const x = new Bus(route.getArc(b)); // eslint-disable-line no-unused-vars
  route.patch(a, c);
  const y = new Bus(route.getArc(a)); // eslint-disable-line no-unused-vars
  route.patch(a, d);
  assert.deepEqual(waypoints(route), [a, c, d]);
  assert.deepEqual(arcs(route), ['→c', '→c', 'c→d', 'd→a', 'a→d'].sort());
  y._arrive();
  assert.deepEqual(waypoints(route), [a, c, d]);
  assert.deepEqual(arcs(route), ['→c', 'c→d', 'd→a', 'a→d'].sort());
});

QUnit.test('get ETA of bus at location', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  const city = new City(graph, graph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(a));
  assert.deepEqual(x.getETA(a), 0.0);
});

QUnit.test('get ETA of bus arriving at location', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  const city = new City(graph, graph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(a));
  assert.deepEqual(x.getETA(b), 2.0);
});

QUnit.test('get ETA of bus departing location', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  const city = new City(graph, graph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(a));
  x._decide();
  city.currentTime += 1.0;
  assert.deepEqual(x.getETA(a), 3.0);
});

QUnit.test('get next ETA of bus never returning to location', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  graph.addEdge(b, new UndirectedEdge(2.0), c);
  graph.addEdge(a, new UndirectedEdge(2.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a));
  route.patch(a, c);
  assert.deepEqual(x.getETA(b, 3.0), Infinity);
});

QUnit.test('get next ETA of bus returning to location', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  const city = new City(graph, graph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(a));
  assert.deepEqual(x.getETA(a, 3.0), 4.0);
});

QUnit.test('get ETA of a stopped bus at a vertex', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  graph.addEdge(b, new UndirectedEdge(2.0), c);
  graph.addEdge(a, new UndirectedEdge(2.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a));
  x.addPassenger(new Passenger(city, 'p', 3.0, a));
  x._decide();
  x.stop();
  assert.deepEqual(x.getETA(a), 0.0);
  assert.deepEqual(x.getETA(b), 2.0);
  assert.deepEqual(x.getETA(c), Infinity);
});

QUnit.test('get ETA of a stopped bus mid-arc', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  graph.addEdge(b, new UndirectedEdge(2.0), c);
  graph.addEdge(a, new UndirectedEdge(2.0), c);
  const city = new City(graph, graph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a));
  x._decide();
  city.currentTime += 1.0;
  x.stop();
  assert.deepEqual(x.getETA(a), Infinity);
  assert.deepEqual(x.getETA(b), 1.0);
  assert.deepEqual(x.getETA(c), Infinity);
});

QUnit.test('get next arrival of two-bus route', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  const city = new City(graph, graph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(b));
  x._decide();
  const y = new Bus(route.getArc(a));
  y._decide();
  city.currentTime += 1.0;
  const result = route.getNextArrival(a);
  assert.deepEqual(result.bus, x);
  assert.deepEqual(result.eta, 1.0);
});

QUnit.test('get next arrival of two-bus route after delay', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  const city = new City(graph, graph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(b));
  x._decide();
  const y = new Bus(route.getArc(a));
  y._decide();
  city.currentTime += 1.0;
  const result = route.getNextArrival(a, 3.0);
  assert.deepEqual(result.bus, y);
  assert.deepEqual(result.eta, 3.0);
});

QUnit.test('get next arrival of a stopped bus', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addEdge(a, new UndirectedEdge(2.0), b);
  const city = new City(graph, graph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(b));
  x._decide();
  city.currentTime += 1.0;
  x.stop();
  const result = route.getNextArrival(a);
  assert.deepEqual(result.bus, undefined);
  assert.deepEqual(result.eta, Infinity);
});

function instructions(plan, city) {
  const result = [];
  for (const step of plan) {
    const travel = step.route !== undefined ? `route ${city.routes.indexOf(step.route)}` : 'walk';
    result.push(`${travel} to ${step.destination} at time ${step.eta}`);
  }
  return result;
}

QUnit.test('find a pedestrian path from a vertex to a neighbor with no shortcuts available', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(graph, graph);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger._plan();
  assert.deepEqual(instructions(passenger.plan, city), ['walk to c at time 8']);
});

QUnit.test('find a pedestrian path from a vertex to a neighbor with a shortcut available', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  graph.addEdge(b, new UndirectedEdge(7), c);
  graph.addEdge(a, new UndirectedEdge(10), c);
  const city = new City(graph, graph);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger._plan();
  // the search should find the shortest path in terms of number of vertices, not total weighted length
  assert.deepEqual(instructions(passenger.plan, city), ['walk to b at time 2', 'walk to c at time 9']);
});

QUnit.test('find a pedestrian path from a vertex to a neighbor with a useful bus route', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), c);
  walkGraph.addEdge(c, new UndirectedEdge(14), d);
  walkGraph.addEdge(d, new UndirectedEdge(2), a);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  driveGraph.addEdge(b, new UndirectedEdge(7), c);
  driveGraph.addEdge(c, new UndirectedEdge(4), d);
  driveGraph.addEdge(d, new UndirectedEdge(1), a);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, d);
  route.patch(a, b, c, d);
  const x = new Bus(route.getArc(c)); // eslint-disable-line no-unused-vars
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger._plan();
  assert.deepEqual(instructions(passenger.plan, city), ['route 0 to c at time 9']);
});

QUnit.test('find a pedestrian path from a vertex to a neighbor with both walking and bus riding', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const e = new Vertex('e');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addVertex(e);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), c);
  walkGraph.addEdge(c, new UndirectedEdge(14), d);
  walkGraph.addEdge(d, new UndirectedEdge(12), e);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addVertex(e);
  driveGraph.addEdge(b, new UndirectedEdge(7), c);
  driveGraph.addEdge(c, new UndirectedEdge(7), d);
  driveGraph.addEdge(d, new UndirectedEdge(7), e);
  driveGraph.addEdge(e, new UndirectedEdge(7), b);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, e);
  route.patch(b, c, d, e);
  const x = new Bus(route.getArc(e)); // eslint-disable-line no-unused-vars
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = d;
  passenger._plan();
  assert.deepEqual(instructions(passenger.plan, city), ['walk to b at time 4', 'walk to c at time 18', 'walk to d at time 32']);
});

QUnit.test('find a nonexistent pedestrian path', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  const city = new City(graph, graph);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger._plan();
  assert.deepEqual(instructions(passenger.plan, city), ['walk to a at time 3']);
});

QUnit.test('simulate a passenger having no path', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addEdge(a, new UndirectedEdge(2), b);
  const city = new City(graph, graph);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  const time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(passenger.vertex, a);
});

QUnit.test('simulate a passenger taking an indirect path', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const graph = new UndirectedGraph();
  graph.addVertex(a);
  graph.addVertex(b);
  graph.addVertex(c);
  graph.addVertex(d);
  graph.addEdge(a, new UndirectedEdge(5), b);
  graph.addEdge(b, new UndirectedEdge(5), c);
  graph.addEdge(c, new UndirectedEdge(7), d);
  graph.addEdge(a, new UndirectedEdge(2), d);
  const city = new City(graph, graph);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 2);
  assert.deepEqual(passenger.vertex, d);
  time = city.step();
  assert.deepEqual(time, 9);
  assert.deepEqual(passenger.vertex, c);
  time = city.step();
  assert.deepEqual(time, 12);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate a passenger taking a combined walking/riding path', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const e = new Vertex('e');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addVertex(e);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), c);
  walkGraph.addEdge(c, new UndirectedEdge(14), d);
  walkGraph.addEdge(d, new UndirectedEdge(12), e);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addVertex(e);
  driveGraph.addEdge(b, new UndirectedEdge(7), c);
  driveGraph.addEdge(c, new UndirectedEdge(7), d);
  driveGraph.addEdge(d, new UndirectedEdge(7), e);
  driveGraph.addEdge(e, new UndirectedEdge(7), b);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, e);
  route.patch(b, c, d, e);
  const x = new Bus(route.getArc(e));
  x.start();
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = d;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  time = city.step();
  assert.deepEqual(time, 7);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 8);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 15);
  assert.deepEqual(x.vertex, c);
  time = city.step();
  assert.deepEqual(time, 22);
  assert.deepEqual(x.vertex, d); // 10
  time = city.step();
  assert.deepEqual(time, 23);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 26);
  assert.deepEqual(passenger.vertex, d);
  time = city.step();
  assert.deepEqual(time, 29);
  assert.deepEqual(passenger.vertex, d);
});

QUnit.test('simulate restarting a bus\'s decision making while a passenger is boarding', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(a));
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = b;
  passenger.start();
  x.start();
  city.addEvent(new SimulationEvent(0.5, () => undefined));
  let time = city.step();
  assert.deepEqual(time, 0.5);
  assert.deepEqual(passenger.boarding, true);
  x.restart();
  time = city.step();
  assert.deepEqual(time, 1);
  assert.deepEqual(passenger.bus, x);
  time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
});

QUnit.test('simulate restarting a bus\'s decision making while a passenger is alighting', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, b);
  const x = new Bus(route.getArc(a));
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = b;
  passenger.start();
  x.start();
  city.addEvent(new SimulationEvent(3.5, () => undefined));
  let time = city.step();
  assert.deepEqual(time, 1);
  assert.deepEqual(passenger.bus, x);
  time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 3.5);
  assert.deepEqual(passenger.alighting, true);
  x.restart();
  time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  time = city.step();
  assert.deepEqual(time, 6);
  assert.deepEqual(x.vertex, a);
});

QUnit.test('simulate a passenger replanning after they cannot board a full bus', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  driveGraph.addEdge(b, new UndirectedEdge(7), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, c);
  const x = new Bus(route.getArc(c), 0);
  x.start();
  const y = new Bus(route.getArc(b));
  y.start();
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  time = city.step();
  assert.deepEqual(time, 7);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 14);
  assert.deepEqual(passenger.boarding, true);
  time = city.step();
  assert.deepEqual(time, 15);
  assert.deepEqual(y.vertex, b);
  time = city.step();
  assert.deepEqual(time, 21);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 22);
  assert.deepEqual(passenger.alighting, true);
  time = city.step();
  assert.deepEqual(time, 23);
  assert.deepEqual(passenger.vertex, c);
  time = city.step();
  assert.deepEqual(time, 26);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate a passenger replanning after their bus is rerouted while they are at a vertex', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), d);
  walkGraph.addEdge(d, new UndirectedEdge(1), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, c);
  const x = new Bus(route.getArc(c));
  x.start();
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  route.patch(b, a, c);
  route.patch(c, a);
  time = city.step();
  assert.deepEqual(time, 6);
  assert.deepEqual(x.vertex, c);
  time = city.step();
  assert.deepEqual(time, 14);
  assert.deepEqual(x.vertex, a);
  time = city.step();
  assert.deepEqual(time, 18);
  assert.deepEqual(passenger.vertex, d);
  time = city.step();
  assert.deepEqual(time, 19);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate a passenger replanning after their bus is rerouted while they are walking', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), d);
  walkGraph.addEdge(d, new UndirectedEdge(1), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, c);
  const x = new Bus(route.getArc(c));
  x.start();
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  route.patch(b, a, c);
  route.patch(c, a);
  time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  time = city.step();
  assert.deepEqual(time, 6);
  assert.deepEqual(x.vertex, c);
  time = city.step();
  assert.deepEqual(time, 14);
  assert.deepEqual(x.vertex, a);
  time = city.step();
  assert.deepEqual(time, 18);
  assert.deepEqual(passenger.vertex, d);
  time = city.step();
  assert.deepEqual(time, 19);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate a passenger alighting after the bus they are riding is rerouted', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(14), b);
  walkGraph.addEdge(b, new UndirectedEdge(5), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(3), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a));
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  x.start();
  city.addEvent(new SimulationEvent(2, () => undefined));
  let time = city.step();
  assert.deepEqual(time, 2);
  route.patch(b, a);
  time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 6);
  assert.deepEqual(x.vertex, a);
  time = city.step();
  assert.deepEqual(time, 9);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 12);
  assert.deepEqual(x.vertex, a);
  time = city.step();
  assert.deepEqual(time, 14);
  assert.deepEqual(passenger.vertex, b);
  time = city.step();
  assert.deepEqual(time, 15);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 18);
  assert.deepEqual(x.vertex, a);
  time = city.step();
  assert.deepEqual(time, 19);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate a passenger continuing to ride after the bus they are riding is rerouted', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addEdge(a, new UndirectedEdge(14), b);
  walkGraph.addEdge(b, new UndirectedEdge(5), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addEdge(a, new UndirectedEdge(1.5), d);
  driveGraph.addEdge(d, new UndirectedEdge(1.5), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, c);
  route.patch(a, d, b, c);
  const x = new Bus(route.getArc(a));
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  x.start();
  city.addEvent(new SimulationEvent(2, () => undefined));
  let time = city.step();
  assert.deepEqual(time, 1);
  assert.deepEqual(x.vertex, a);
  time = city.step();
  assert.deepEqual(time, 2);
  route.patch(a, c);
  time = city.step();
  assert.deepEqual(time, 2.5);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 3.5);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 5);
  assert.deepEqual(x.vertex, b);
  assert.deepEqual(passenger.vertex, undefined);
  time = city.step();
  assert.deepEqual(time, 6.5);
  assert.deepEqual(passenger.vertex, d);
});

QUnit.test('simulate a passenger replanning after their bus is stopped while they are at a vertex', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, c);
  const x = new Bus(route.getArc(c));
  x.start();
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  x.stop();
  time = city.step();
  assert.deepEqual(time, 6);
  assert.deepEqual(route.buses.size, 0);
  time = city.step();
  assert.deepEqual(time, 20);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate a passenger replanning after their bus is stopped while they are walking', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, c);
  const x = new Bus(route.getArc(c));
  x.start();
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  x.stop();
  assert.deepEqual(route.buses.size, 0);
  time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  time = city.step();
  assert.deepEqual(time, 18);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate passengers alighting after the bus they are riding is stopped', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(14), b);
  walkGraph.addEdge(b, new UndirectedEdge(5), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(3), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a), 2);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  const companion = new Passenger(city, 'q', 3.0, a);
  companion.source = a;
  companion.destination = c;
  companion.start();
  x.start();
  city.addEvent(new SimulationEvent(3, () => undefined));
  let time = city.step();
  assert.deepEqual(time, 1);
  assert.deepEqual(x.vertex, a);
  x.stop();
  time = city.step();
  assert.deepEqual(time, 14);
  assert.deepEqual(passenger.vertex, b);
  assert.deepEqual(companion.vertex, b);
  assert.deepEqual(route.buses.size, 0);
  time = city.step();
  assert.deepEqual(time, 19);
  assert.deepEqual(passenger.vertex, c);
  assert.deepEqual(companion.vertex, c);
});

QUnit.test('simulate a passenger replanning after their bus route is retired while they are at a vertex', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, c);
  const x = new Bus(route.getArc(c));
  x.start();
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  route.retire();
  time = city.step();
  assert.deepEqual(time, 6);
  assert.deepEqual(route.buses.size, 0);
  assert.deepEqual(city.routes[0], undefined);
  time = city.step();
  assert.deepEqual(time, 20);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate a passenger replanning after their bus route is retired while they are walking', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(14), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(2), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, b, c);
  const x = new Bus(route.getArc(c));
  x.start();
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(x.vertex, b);
  route.retire();
  assert.deepEqual(route.buses.size, 0);
  assert.deepEqual(city.routes[0], undefined);
  time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  time = city.step();
  assert.deepEqual(time, 18);
  assert.deepEqual(passenger.vertex, c);
});

QUnit.test('simulate passengers alighting after the route for the bus they are riding is retired', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addEdge(a, new UndirectedEdge(14), b);
  walkGraph.addEdge(b, new UndirectedEdge(5), c);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addEdge(a, new UndirectedEdge(3), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(a, new UndirectedEdge(8), c);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, c);
  route.patch(a, b, c);
  const x = new Bus(route.getArc(a), 2);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = c;
  passenger.start();
  const companion = new Passenger(city, 'q', 3.0, a);
  companion.source = a;
  companion.destination = c;
  companion.start();
  x.start();
  city.addEvent(new SimulationEvent(3, () => undefined));
  let time = city.step();
  assert.deepEqual(time, 1);
  assert.deepEqual(x.vertex, a);
  time = city.step();
  route.retire();
  assert.deepEqual(time, 2);
  assert.deepEqual(passenger.vertex, undefined);
  assert.deepEqual(companion.vertex, undefined);
  assert.deepEqual(route.buses.size, 1);
  assert.deepEqual(city.routes[0], {
  "arcs": {},
  "buses": {},
  "city": {
    "_passengers": [
      {
        "_alightingBeginTime": undefined,
        "_alightingEndTime": undefined,
        "_arrivalTime": undefined,
        "_boardingBeginTime": undefined,
        "_boardingEndTime": undefined,
        "_bus": {
          "_alightingPassenger": undefined,
          "_arc": [graph],
          "_arrivalTime": 5,
          "_departureTime": 2,
          "_nextEvent": [object Object],
          "_waitingTime": undefined,
          "boardingIndex": undefined,
          "boardingPassenger": undefined,
          "loadingDelay": 1,
          "passengers": [object Array],
          "simulation": recursion(-4),
          "stopping": true,
          "unloadingDelay": 1
        },
        "_departureTime": undefined,
        "_nextEvent": undefined,
        "_vertex": undefined,
        "destination": {
          "name": "c",
          "passengers": [object Array]
        },
        "inactiveTime": 3,
        "name": "p",
        "plan": [
          [object Object]
        ],
        "simulation": recursion(-3),
        "source": {
          "name": "a",
          "passengers": [object Array]
        }
      },
      {
        "_alightingBeginTime": undefined,
        "_alightingEndTime": undefined,
        "_arrivalTime": undefined,
        "_boardingBeginTime": undefined,
        "_boardingEndTime": undefined,
        "_bus": {
          "_alightingPassenger": undefined,
          "_arc": [object Object],
          "_arrivalTime": 5,
          "_departureTime": 2,
          "_nextEvent": [object Object],
          "_waitingTime": undefined,
          "boardingIndex": undefined,
          "boardingPassenger": undefined,
          "loadingDelay": 1,
          "passengers": [object Array],
          "simulation": recursion(-4),
          "stopping": true,
          "unloadingDelay": 1
        },
        "_departureTime": undefined,
        "_nextEvent": undefined,
        "_vertex": undefined,
        "destination": {
          "name": "c",
          "passengers": [object Array]
        },
        "inactiveTime": 3,
        "name": "q",
        "plan": [
          [object Object]
        ],
        "simulation": recursion(-3),
        "source": {
          "name": "a",
          "passengers": [object Array]
        }
      }
    ],
    "currentTime": 2,
    "driveGraph": {
      "adjacencyMatrix": [
        [
          undefined,
          [object Object],
          [object Object]
        ],
        [
          [object Object],
          undefined,
          [object Object]
        ],
        [
          [object Object],
          [object Object],
          undefined
        ]
      ],
      "edges": [
        {
          "weight": 3
        },
        {
          "weight": 3
        },
        {
          "weight": 8
        }
      ],
      "vertices": [
        {
          "name": "a",
          "passengers": [object Array]
        },
        {
          "name": "b",
          "passengers": [object Array]
        },
        {
          "name": "c",
          "passengers": [object Array]
        }
      ]
    },
    "pendingEvents": {
      "elements": [
        {
          "effect": function(){
            [code]
          },
          "time": 3
        },
        {
          "effect": function(){
            [code]
          },
          "time": 5
        }
      ],
      "metric": function( a ){
        [code]
      }
    },
    "routes": [
      recursion(-3)
    ],
    "walkGraph": {
      "adjacencyMatrix": [
        [
          undefined,
          [object Object],
          undefined
        ],
        [
          [object Object],
          undefined,
          [object Object]
        ],
        [
          undefined,
          [object Object],
          undefined
        ]
      ],
      "edges": [
        {
          "weight": 14
        },
        {
          "weight": 5
        }
      ],
      "vertices": [
        {
          "name": "a",
          "passengers": [object Array]
        },
        {
          "name": "b",
          "passengers": [object Array]
        },
        {
          "name": "c",
          "passengers": [object Array]
        }
      ]
    }
  },
  "moribund": true,
  "waypoints": {}
});
  time = city.step();
  assert.deepEqual(time, 3);
  assert.deepEqual(passenger.vertex, undefined);
  assert.deepEqual(companion.vertex, undefined);
});

QUnit.test('simulate a passenger replanning after a bus is added at their vertex', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(15), c);
  walkGraph.addEdge(c, new UndirectedEdge(15), d);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addEdge(a, new UndirectedEdge(3), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(c, new UndirectedEdge(3), d);
  driveGraph.addEdge(a, new UndirectedEdge(3), d);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, b);
  route.patch(b, c, d, a);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = d;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  const x = new Bus(route.getArc(b));
  x.start();
  // assert.deepEqual(passenger.walkingSource, undefined);
  time = city.step();
  assert.deepEqual(time, 5);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 8);
  assert.deepEqual(x.vertex, c);
  time = city.step();
  assert.deepEqual(time, 11);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 12);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 15);
  assert.deepEqual(x.vertex, a);
  assert.deepEqual(passenger.vertex, d);
  time = city.step();
  assert.deepEqual(time, 18);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 21);
  assert.deepEqual(x.vertex, c);
  time = city.step();
  assert.deepEqual(time, 24);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 25);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 28);
  assert.deepEqual(x.vertex, a);
  assert.deepEqual(passenger.vertex, undefined);
});

QUnit.test('simulate a passenger replanning after a bus is added elsewhere', (assert) => {
  const a = new Vertex('a');
  const b = new Vertex('b');
  const c = new Vertex('c');
  const d = new Vertex('d');
  const walkGraph = new UndirectedGraph();
  walkGraph.addVertex(a);
  walkGraph.addVertex(b);
  walkGraph.addVertex(c);
  walkGraph.addVertex(d);
  walkGraph.addEdge(a, new UndirectedEdge(4), b);
  walkGraph.addEdge(b, new UndirectedEdge(15), c);
  walkGraph.addEdge(c, new UndirectedEdge(26), d);
  const driveGraph = new UndirectedGraph();
  driveGraph.addVertex(a);
  driveGraph.addVertex(b);
  driveGraph.addVertex(c);
  driveGraph.addVertex(d);
  driveGraph.addEdge(a, new UndirectedEdge(3), b);
  driveGraph.addEdge(b, new UndirectedEdge(3), c);
  driveGraph.addEdge(c, new UndirectedEdge(3), d);
  driveGraph.addEdge(a, new UndirectedEdge(3), d);
  const city = new City(walkGraph, driveGraph);
  const route = new Route(city, a, d);
  route.patch(a, b, c, d);
  const passenger = new Passenger(city, 'p', 3.0, a);
  passenger.source = a;
  passenger.destination = d;
  passenger.start();
  let time = city.step();
  assert.deepEqual(time, 4);
  assert.deepEqual(passenger.vertex, b);
  const x = new Bus(route.getArc(a));
  x.start();
  time = city.step();
  assert.deepEqual(time, 7);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 8);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 11);
  assert.deepEqual(x.vertex, c);
  time = city.step();
  assert.deepEqual(time, 14);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 15);
  assert.deepEqual(x.vertex, d);
  assert.deepEqual(passenger.vertex, d); // 13
  time = city.step();
  assert.deepEqual(time, 18);
  assert.deepEqual(x.vertex, a);
  time = city.step();
  assert.deepEqual(time, 21);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 24);
  assert.deepEqual(x.vertex, c);
  time = city.step();
  assert.deepEqual(time, 27);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 28);
  assert.deepEqual(x.vertex, d);
  time = city.step();
  assert.deepEqual(time, 31);
  assert.deepEqual(x.vertex, a); //
  time = city.step();
  assert.deepEqual(time, 34);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 35);
  assert.deepEqual(x.vertex, b);
  time = city.step();
  assert.deepEqual(time, 38);
  assert.deepEqual(passenger.vertex, b);
});
