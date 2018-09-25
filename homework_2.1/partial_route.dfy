type Vertex(==)
type Route(==)
type InducedGraph<-Vertex> = Vertex -> bool

function method undefinedRoute(): Route

function method undefinedPath(): seq<Vertex>

function method core(route: Route): set<Vertex>
  requires route != undefinedRoute();

function method indexIn<T>(element: T, list: seq<T>): int
  ensures exists result | result == indexIn(element, list) :: // (ab)use exists to give a name to the result
    (element !in list <==> result == -1) &&
    (element in list <==> 0 <= result < |list| && list[result] == element);

function method createInducedGraph(vertexPredicate: Vertex -> bool): InducedGraph<Vertex> { vertexPredicate }

function method shortestUndirectedPath(graph: InducedGraph<Vertex>, source: Vertex, destination: Vertex): seq<Vertex>
  ensures exists result | result == shortestUndirectedPath(graph, source, destination) :: // (ab)use exists to give a name to the result
    result == undefinedPath() ||
    (|result| > 0 && result[0] == source && result[|result|-1] == destination &&
      forall i | 0 <= i < |result| ::
        graph(result[i]) && forall j | 0 <= j < |result| :: i != j ==> result[i] != result[j])

method update(route: Route, vertices: seq<Vertex>, vertex: Vertex) returns (result: seq<Vertex>)
  requires forall index | 0 <= index < |vertices| :: forall index2 | 0 <= index2 < |vertices| && index2 != index :: vertices[index] != vertices[index2]
  requires |vertices| == 1 || |vertices| == 0;
  ensures forall index | 0 <= index < |result| :: forall index2 | 0 <= index2 < |result| && index2 != index :: result[index] != result[index2] || (index == 0 && index2 == |result|-1) || (index2 == 0 && index == |result|-1)
  ensures result == [];
{
  if |vertices| == 0 {
    if route == undefinedRoute() || vertex in core(route){
      var vertices := [vertex];
    }
  } else {
    var index := indexIn(vertex, vertices);
    if index == 0 || (route == undefinedRoute() && index == 0 && |vertices| > 1) {
      var source := vertices[0];
      var vertexPredicate := otherVertex => (otherVertex == source || otherVertex == vertex ||
      !((route != undefinedRoute() && otherVertex in core(route)) || otherVertex in vertices));
      var induced := createInducedGraph(vertexPredicate);
      var path := shortestUndirectedPath(induced, source, vertex);
      if path != undefinedPath() {
        var vertices := vertices + path[..1];
      }
    } else if (index == 0) {
       var vertices: seq<int> := [];
    } else {
      var vertices := vertices[index + 1..];
    }
  }
}
