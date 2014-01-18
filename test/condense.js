var util = require("./util");
var tern = require("../lib/tern"), condense = require("../lib/condense");
var fs = require("fs"), path = require("path");
require("../plugin/angular");
require("../plugin/node");

var condenseDir = "test/condense";
function jsonFile(name) { return util.resolve(condenseDir + "/" + name.replace(/\.js$/, ".json")); }

function runTest(options) {
  var defs = options.defs || [util.ecma5, util.browser];
  var server = new tern.Server({
    defs: defs,
    plugins: options.plugins,
    projectDir: util.resolve(condenseDir),
    getFile: function(name) {
      return fs.readFileSync(path.resolve(condenseDir, name), "utf8");
    }
  });
  options.load.forEach(function(file) {
    server.addFile(file);
  });
  server.flush(function() {
    var condenseOptions = options.condenseOptions || {sortOutput: true};
    var origins = options.include || options.load;
    var condensed = condense.condense(origins, null, condenseOptions);
    var out = JSON.stringify(condensed, null, 2);
    var expect = fs.readFileSync(jsonFile(origins[0]), "utf8").trim();
    if (out != expect)
      return util.failure("condense/" + origins[0] + ": Mismatch in condense output. Got " +
                          out + "\nExpected " + expect);

    if (options.skipReload) return;
    // Test loading the condensed defs.
    defs.push(condensed);
    var server2 = new tern.Server({
      defs: defs,
      plugins: options.plugins
    });
    server2.flush(function() {
      var condensed = condense.condense(origins, null, condenseOptions);
      var out = JSON.stringify(condensed, null, 2);
      if (out != expect)
        util.failure("condense/" + origins[0] + ": Mismatch in condense output after loading defs. Got " +
                     out + "\nExpected " + expect);
    });
  });
}

exports.runTests = function(filter) {
  function jsFile(f) {
    return f + ".js";
  }
  function test(options) {
    if (typeof options == "string") options = {load: [options]};
    options.load = options.load.map(jsFile);
    if (options.include) options.include = options.include.map(jsFile);
    if (filter && (options.include || options.load)[0].indexOf(filter) == -1) return;
    util.addTest();
    util.addFile();
    runTest(options);
  }

  test("basic");
  test("fn");
  test("add_to_old");
  test({load: ["ignore_newer", "extend_foo"],
        include: ["ignore_newer"]});
  test("ref_to_old");
  test("ref_in_type");
  test("double_ref");
  test("proto");
  test("generic");

  test({load: ["flat"], condenseOptions: {flat: true, sortOutput: true}, skipReload: true});

  test({load: ["node_simple"], plugins: {node: true}});
  test({load: ["node_fn_export"], plugins: {node: true}});
  test({load: ["node_other_module_type_ref"], include: ["node_other_module_type_ref", "node_export_function_a"], plugins: {node: true}});

  test({load: ["angular_simple"], plugins: {angular: true}});

  test({load: ["requirejs_const"], plugins: {requirejs: true}});
  test({load: ["requirejs_primitive"], plugins: {requirejs: true}});
  test({load: ["requirejs_setup"], plugins: {requirejs: true}});
  test({load: ["requirejs_empty_deps"], plugins: {requirejs: true}});
  // TODO(sqs): if load order is reversed, then
  // !define.!requirejs.requirejs_dep.a duplicates the definition instead of
  // referring to !requirejs.requirejs_const.
  test({load: ["requirejs_const", "requirejs_dep"], include: ["requirejs_dep", "requirejs_const"], plugins: {requirejs: true}});
  test({load: ["src/core", "requirejs_copy_this_effect"], include: ["requirejs_copy_this_effect", "src/core"], plugins: {requirejs: true}, defs: [util.jquery_requirejs_extend], skipReload: true});

  var c = JSON.parse(fs.readFileSync(util.resolve("test/cases/defs/requirejs_extend_this.json")));
  test({load: ["requirejs_extend_this"], plugins: {requirejs: true}, defs: [c], skipReload: true});
};
