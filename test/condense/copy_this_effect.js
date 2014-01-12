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

A.foo;
(new A()).foo;
