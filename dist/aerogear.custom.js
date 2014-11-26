var define, requireModule, requireModules;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod = registry[name];
    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    var deps = mod.deps,
      callback = mod.callback,
      reified = [],
      exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };

  requireModules = function(names) {
    names = names || [];
    names.forEach(function(name) {
      requireModule(name);
    });
  };
})();


(function(globals) {
define("test1", ["exports"], function(__exports__) {
  "use strict";

  function __es6_export__(name, value) {
    __exports__[name] = value;
  }

  console.log('another');
  console.log('123');
  console.log('third');
});

//
define("test2", ["exports"], function(__exports__) {
  "use strict";

  function __es6_export__(name, value) {
    __exports__[name] = value;
  }

  console.log('abc');
  console.log('xyz');
  console.log('third line');
});

//
// expose global AeroGear
//globals.AeroGear = requireModule("aerogear.core")['AeroGear'];
// load all modules that we want to leverage (they will load dependencies transitively)
requireModules(['test1', 'test2']);

})(window);


//# sourceMappingURL=aerogear.custom.js.map