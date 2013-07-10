// environment=extendTest

///////////////////////////////////////////////////////////////////////////////
// define our extend funcs
// we also have global "extendTest" defined in defs/extendTest.json

// simple extend func
function extend0(dst, src) {
  for (var prop in src)
    dst[prop] = src[prop];
  return dst;
}

// extend func similar to underscore.js's
// https://github.com/jashkenas/underscore/blob/14c3f9a11fe4711876148c31f9eafba947611477/underscore.js#L787-L796
function extend1(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};


///////////////////////////////////////////////////////////////////////////////
// test using extend0

function S0() {}
S0.s0 = 1;
S0.extend = function(protoProps) {
  var parent = this;
  var child = function() {};
  extend0(child, parent);
  // for (var prop in parent) {
  //   child[prop] = parent[prop];
  // }
  extend0(child.prototype, protoProps);
  return child;
}
var T0 = S0.extend({t0: true}), U0 = S0.extend({u0: true});
T0.s0; //: number
var s0 = new S0(), t0 = new T0();
t0.t0; //: bool
t0.u0; //: ?
s0.t0; //: ?
s0.u0; //: ?


///////////////////////////////////////////////////////////////////////////////
// test using extend1

function S1() {}
S1.s1 = 1;
S1.extend = function(protoProps) {
  var parent = this;
  var child = function() {};
  extend1(child, parent);
  // for (var prop in parent) {
  //   child[prop] = parent[prop];
  // }
  extend1(child.prototype, protoProps);
  return child;
}
var T1 = S1.extend({t1: true}), U1 = S1.extend({u1: true});
T1.s1; //: number
var s1 = new S1(), t1 = new T1();
t1.t1; //: bool
t1.u1; //: ?
s1.t1; //: ?
s1.u1; //: ?


///////////////////////////////////////////////////////////////////////////////
// test using extendTest

function S2() {}
S2.s2 = 1;
S2.extend = function(protoProps) {
  var parent = this;
  var child = function() {};
  extendTest(child, parent);
  // for (var prop in parent) {
  //   child[prop] = parent[prop];
  // }
  extendTest(child.prototype, protoProps);
  return child;
}
var T2 = S2.extend({t2: true}), U2 = S2.extend({u2: true});
T2.s2; //: number
var s2 = new S2(), t2 = new T2();
t2.t2; //: bool
t2.u2; /*FAILING*///: ?
s2.t2; /*FAILING*///: ?
s2.u2; /*FAILING*///: ?
