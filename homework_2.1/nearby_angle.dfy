function method undefinedReal(): real
function method pi(): real
  ensures pi() > 0.0
function method tau(): real { 2.0 * pi() }
function method fmod(dividend: real, divisor: real): real
  requires divisor > 0.0
  ensures -divisor < fmod(dividend, divisor) < divisor;

// Equivalent to toDirection method in positioned_graph.js on line 15.
method nearby_angle_sad(arctangent: real, reference: real) returns (result: real) 
  requires reference != undefinedReal()
  ensures -pi() < result - reference <= pi()
{
  if (reference != undefinedReal()) {
    var delta := fmod((arctangent - reference), tau());
    if (delta <= -pi()){
      delta := delta + tau();
    } else if (delta > pi()) {
      delta := delta - tau();
    }
    return reference + delta;
  }
  return arctangent;
}

method nearby_angle_happy(arctangent: real, reference: real) returns (result: real)
  requires reference == undefinedReal()
  ensures result == arctangent
{
  if (reference != undefinedReal()) {
    var delta := fmod((arctangent - reference), tau());
    if (delta <= -pi()){
      delta := delta + tau();
    } else if (delta > pi()) {
      delta := delta - tau();
    }
    return reference + delta;
  }
  return arctangent;
}
