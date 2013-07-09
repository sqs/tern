// environment=underscore

// Adapted from Backbone's extend function:
// https://github.com/jashkenas/backbone/blob/ae90da0fff643746e35e0c3b7d1b44c18f65f88c/backbone.js#L1532-L1563

function Person() {}
_.extend(Person.prototype, {a: 1});

Person.extend = function(protoProps) {
  var parent = this;
  var child = function() { return parent.apply(this, arguments); };
  _.extend(child, parent);

  // var Surrogate = function(){ this.constructor = child; };
  // Surrogate.prototype = parent.prototype;
  // child.prototype = new Surrogate;

  _.extend(child.prototype, protoProps);
  return child;
};

var Dancer = Person.extend({isDancer: true});
(new Dancer()).isDancer; //: bool
(new Dancer()).isSinger; /*failing*///: ?
var Singer = Person.extend({isSinger: true});
(new Singer()).isSinger; //: bool
(new Singer()).isDancer; /*failing*///: ?

var p = new Person(); //: Person
p.isDancer; /*failing*///: ?
p.isSinger; /*failing*///: ?
