(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("../lib/infer"), require("../lib/tern"), require);
  if (typeof define == "function" && define.amd) // AMD
    return define(["../lib/infer", "../lib/tern"], mod);
  mod(tern, tern);
})(function(infer, tern, require) {
  "use strict";

  infer.registerFunction("backboneExtend", function(_self, args, argNodes) {
    var cls = new infer.AVal();
    var clsType = new infer.Obj(_self.getType());
    cls.addType(clsType);

    var protoProps = args[0];
    var clsProto = clsType.getProp("prototype").getType();
    protoProps.forAllProps(function(prop, val, local) {
      if (local) {
        val.propagate(clsProto.defProp(prop));
      }
    });

    var staticProps = args[1];
    staticProps.forAllProps(function(prop, val, local) {
      if (local) {
        val.propagate(clsType.defProp(prop));
      }
    });

    var attributes = new infer.Obj(true), options = new infer.Obj(true);
    var inst = new infer.Obj(true);
    var ctor = cls.hasCtor = new infer.Fn(null, infer.ANull, [attributes, options], ["attributes", "options"], inst);

    var instAttributes = inst.defProp("attributes");
    attributes.forAllProps(function(prop, val, local) {
      if (local) val.propagate(instAttributes.defProp(prop));
    });

    return cls;
  });

  tern.registerPlugin("backbone", function(server, options) {
    server._backbone = {
      modules: Object.create(null),
      options: options || {},
      currentFile: null,
      server: server
    };

    server.on("beforeLoad", function(file) {
      this._backbone.currentFile = file.name;
    });

    server.on("afterLoad", function(file) {
      this._backbone.currentFile = null;
    });

    server.on("reset", function() {
      this._backbone.modules = Object.create(null);
    });

    return {defs: defs};
  });

  var defs = {
    "!name": "backbone",
    "Backbone": {
      "Model": {
        "extend": "extend",
        "prototype": {
          "id": "string",
          "get": {
            "!type": "fn(key: string) -> ?"
          },
          "set": {
            "!type": "fn(props: ?) -> ?"
          }
        }
      }
    },
    "!define": {
      "extend": {
        "!type": "fn(protoProps: ?, staticProps: ?) -> !custom:backboneExtend"
      }
    }
  };
});
