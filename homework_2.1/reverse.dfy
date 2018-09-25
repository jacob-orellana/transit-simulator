method reverse<T>(input: seq<T>) returns (result: seq<T>)
  requires |input| > 0
  ensures |input| == |result| // the input list and the result list have the same length
  ensures forall x | 0 <= x < |input| :: input[x] == result[(|result| - 1 - x)] // every element found in result
  {
  var final : seq<T> := [];
  var i := |input| - 1;
  while i >= 0
    invariant -1 <= i < |input|
    invariant |input| - 1 == |final| + i
    invariant forall x | 0 <= x < |input| - 1 - i :: input[(|input| - 1 - x)] == final[x]
    {
    final := final + [input[i]];
    i := i - 1;
  }
  return final;
}
