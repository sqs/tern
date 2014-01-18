// environment=extend_this

function A() {}

A.extend({b: function() {}, c: 3});

A.b; //: fn()
A.c; //: number
