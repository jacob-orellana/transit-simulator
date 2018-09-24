method reverse<T>(input: seq<T>) returns (result: seq<T>)
  ensures |input| == |result| // the input list and the result list have the same length
  ensures forall x :: 0 <= x <= (|input|-1) ==> result[x] == input[(|input| - 1 - x)] // every element found in result
  {
  var final := [];
  var i := |input| - 1;
  var j := 0;
  while i >= 0
    invariant 0 <= i <= |input|
  {
    final := final[j : input[i]];
    i := i - 1;
    j := j + 1;
  }
  return final;
}
