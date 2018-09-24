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

method sad_next_arrival(route: Route, vertex: Vertex, minimum: real) returns (result: Bus, bestETA: real)
  requires has(route, vertex) == false
  ensures result == undefinedBus() && bestETA == infinity()
{
  var buses := busesOn(route);
  var i := 0;
  var best := infinity();
  var bus := undefinedBus();
  if has(route, vertex) {
    while i < |buses|
    {
      if !isStopping(buses[i]) {
        var eta := getETA(buses[i], vertex, minimum);
        if (eta < best) {
          bus := buses[i];
          best := eta;
        }
      }
      i := i + 1;
    }
  }
  return bus, best;
}

method happy_next_arrival(route: Route, vertex: Vertex, minimum: real) returns (result: Bus, bestETA: real)
  requires has(route, vertex) == true
  ensures bestETA >= minimum
{
  var buses := busesOn(route);
  var i := 0;
  var best := infinity();
  var bus := undefinedBus();
  if has(route, vertex) {
    while i < |buses|
    invariant 0 <= i <= |buses|
    
    {
      if !isStopping(buses[i]) {
        var eta := getETA(buses[i], vertex, minimum);
        if (eta < best) {
          bus := buses[i];
          best := eta;
        }
      }
      i := i + 1;
    }
  }
  return bus, best;
}
