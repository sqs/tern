// environment=extend_copy_this

A.extend({
  foo: function() {
    return "str";
  }
});

A.prototype.extend({
  foo: function() {
    return 123;
  }
});

A.foo; //: fn() -> string
(new A()).foo; //: fn() -> number
