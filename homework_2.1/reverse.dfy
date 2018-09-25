method reverse<T>(input: seq<T>) returns (result: seq<T>)
  requires |input| > 0
  ensures |input| == |result| // the input list and the result list have the same length
  ensures forall x | x >= 0 && x < |input| :: input[x] == result[(|result| - 1 - x)] // every element found in result
  {
  var final : seq<T> := [];
  var i := |input| - 1;
  var j := 0;
  while i >= 0
    invariant i == |input| - 1 - j
    invariant 0 <= j <= |input|
//  invariant forall x | x >= 0 && x <= i :: result[x] == input[|input| - 1 - x]
    {
    final := final + [input[i]];
    i := i - 1;
    j := j + 1;
  }
  return final;
}
