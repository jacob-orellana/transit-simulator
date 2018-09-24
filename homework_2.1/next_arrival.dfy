type Vertex(==)
type Route(==)
type Bus(==)
function method infinity(): real
function method undefinedBus(): Bus
function method has(route: Route, vertex: Vertex): bool
function method busesOn(route: Route): seq<Bus>
function method isStopping(bus: Bus): bool
function method getETA(bus: Bus, vertex: Vertex, minimum: real): real
  ensures minimum <= getETA(bus, vertex, minimum) < infinity();

method next_arrival(route: Route, vertex: Vertex, minimum: real) returns (result: Bus, bestETA: real)
  requires minimum := infinity();
  ensures !exists vertex | vertex in Route :: result := undefinedBus() && bestETA :: infinity()
  ensures exists vertex | vertex in Route :: bestETA <= minimum;
{
  if (result == undefined() && bestETA == infinity()) {
    if (route,has(vertex)) {
      for (bus in busesOn(route)) {
        if isStopping(bus){
          const eta := bus.getETA(vertex, minimum)
          result = bus;
          bestETA = eta;
        }
      }
    }
  }
  return bus;
  return eta;
}
