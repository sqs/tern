(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("../lib/infer"), require("../lib/tern"), require("acorn/util/walk"));
  if (typeof define == "function" && define.amd) // AMD
    return define(["../lib/infer", "../lib/tern", "acorn/util/walk"], mod);
  mod(tern, tern, acorn.walk);
})(function(infer, tern, walk) {
  "use strict";

  tern.registerPlugin("override", function(server, options) {
    return {
      passes: {
        postInfer: function(ast, scope) {
          options.forEach(function(spec) {
            if (!spec.def["!name"]) spec.def["!name"] = "override";

            function override(av, scope) {
              var tmpScope = new infer.Scope();
              infer.def.load(spec.def, tmpScope);
              tmpScope.forAllProps(function(prop, val, local) {
                if (local) {
                  scope.defVar(prop).addType(tmpScope.getProp(prop).getType());
                }
              });
            }

            var visitors = {
              Identifier: {
                Identifier: function(node, scope) {
                  if (node.name == spec.node.name) {
                    if (!spec.add) delete scope.props[node.name];
                    override(scope.defVar(node.name), scope);
                  }
                }
              },
              MemberExpression: {
                MemberExpression: function(node, scope) {
                  if (node.object.type == spec.node.object.type && node.object.name == spec.node.object.name &&
                      (node.property.name || node.property.value) == spec.node.property) {
                    if (!spec.add) {
                      delete scope.props[node.object.name];
                    }
                    override(null, scope);
                  }
                }
              }
            }[spec.node.type];

            walk.simple(ast, visitors, infer.searchVisitor, scope);
          });
        }
      },
    };
  });
});
