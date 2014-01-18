(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("../lib/infer"), require("../lib/tern"));
  if (typeof define == "function" && define.amd) // AMD
    return define(["../lib/infer", "../lib/tern"], mod);
  mod(tern, tern);
})(function(infer, tern) {
  "use strict";

  function postInfer(state) {
    // TODO
  }

  tern.registerPlugin("jquery_requirejs", function(server, options) {
    return {
      passes: {
        postInfer: postInfer
      },
    };
  });

  var defs = {
    "!name": "jquery_extend",
    "!define": {
      module: {
        id: "string",
        uri: "string",
        config: "fn() -> ?",
        exports: "?"
      }
    },
    requirejs: {
      "!type": "fn(deps: [string], callback: fn(), errback: fn()) -> !custom:requireJS",
      onError: "fn(err: +Error)",
      load: "fn(context: ?, moduleName: string, url: string)",
      config: "fn(config: ?) -> !custom:requireJSConfig",
      version: "string",
      isBrowser: "bool"
    },
    require: "requirejs",
    define: {
      "!type": "fn(deps: [string], callback: fn()) -> !custom:requireJS",
      amd: {
        jQuery: "bool"
      }
    }
  };
});
