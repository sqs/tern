define([], function() {
  function A() {}
  A.z = function() {};

  A.extend({b: function() {}, c: 3});

  A; //: fn() -> string

  A.b; //: fn()
  A.c; //: number
  A.z; //: fn()

  return A;
});
