// environment=jquery
// environment=browser
// plugin=backbone

Backbone; //: Backbone
Backbone.Model; //: Backbone.Model
Backbone.Model.extend; //: fn(protoProps: ?, staticProps: ?)

var Person = Backbone.Model.extend({
  defaults: {
    foo: "bar"
  },
  firstInitial: function() { return this.name[0]; }
}, {qux: 1});
Person.qux; //: number
Person.prototype; //:: {defaults: {foo: string}, firstInitial: fn(), get: fn(key: string), id: string, set: fn(props: ?)}

var alice = new Person({firstName: 'Alice'});
alice; //: Person
alice.id; //: string
alice.get("firstName"); //: string
alice.get("foo"); //: string
alice.firstInitial; //: fn() -> string
alice.attributes; //:: {firstName: string, foo: string, id: string}

var Company = Backbone.Model.extend({
  defaults: {
    baz: true
  },
  legalName: function() { return this.name + 'Co'; }
}, {zap: "pow"});
Company.zap; //: string

var exCo = new Company({name: 'Example'});
exCo; //: foo
exCo.id; //: string
exCo.get("name"); //: string
exCo.get("baz"); //: bool
exCo.legalName; //: fn() -> string
exCo.attributes; //: {baz: bool, id: string, name: string}

exCo.set({numEmployees: 5});
exCo.numEmployees; //: number
exCo.get("numEmployees"); //: number

// verify no leakage across classes
alice.legalName; //: ?
alice.get("baz"); //: ?
alice.get("name"); //: ?
alice.get("numEmployees"); //: ?
exCo.get("firstName"); //: ?
exCo.get("foo"); //: ?
exCo.firstInitial; //: ?
