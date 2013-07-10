// environment=underscore

// Using manual extend for-loops: (all tests pass)
function Person() {}
Person.extend = function(protoProps) {
  var parent = this;
  var child = function() { return parent.apply(this, arguments); };
  for (var prop in parent) {
    child[prop] = parent[prop];
  }
  for (var prop in protoProps) {
    child.prototype[prop] = protoProps[prop];
  }
  return child;
};

var Dancer = Person.extend({isDancer: true});
(new Dancer()).isDancer; //: bool
(new Dancer()).isSinger; //: ?
var Singer = Person.extend({isSinger: true});
(new Singer()).isSinger; //: bool
(new Singer()).isDancer; //: ?

var p = new Person(); //: Person
p.isDancer; //: ?
p.isSinger; //: ?


////////////////////////////////////////
////////////////////////////////////////


// Using _.extend: (lines marked FAILING are failing tests)
function Person2() {}
Person2.extend = function(protoProps) {
  var parent = this;
  var child = function() { return parent.apply(this, arguments); };

  _.extend(child, parent);
  // Tests pass if the preceding line is removed or replaced with:
  // for (var prop in parent) {
  //   child[prop] = parent[prop];
  // }

  _.extend(child.prototype, protoProps);
  return child;
};

var Dancer2 = Person2.extend({isDancer: true});
(new Dancer2()).isDancer; //: bool
(new Dancer2()).isSinger; /*FAILING*///: ?
var Singer2 = Person2.extend({isSinger: true});
(new Singer2()).isSinger; //: bool
(new Singer2()).isDancer; /*FAILING*///: ?

var p2 = new Person2(); //: Person2
p2.isDancer; /*FAILING*///: ?
p2.isSinger; /*FAILING*///: ?
