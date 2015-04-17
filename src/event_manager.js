/* global jsio, test */

/* jshint ignore:start */
import event.Emitter as Emitter;
import util.underscore as _;
import .test as test;
/* jshint ignore:end */

exports = (function () {
  'use strict';

  var toCamel = function (str) {
    return str.replace(/\-([a-z])/g, function (split) {
      return split[1].toUpperCase();
    });
  }, modules = {},
  obj = {};

  obj.register = function (path, plugins) {
    this.plugins = plugins;
    plugins.forEach(function (plugin) {
      modules[plugin] = jsio('import ' + path + '.' + plugin + ' as ' + plugin);
    });
  };

  obj.emit = function (signal, data) {
    this.plugins.forEach(function (plugin) {
      var fn = modules[plugin][toCamel(signal)];

      if (typeof fn === 'function') {
        fn(data);
      }
    });
  };

  test.prepare(obj, {
    setJSIO: function (fn) {
      jsio = fn;
    },
    toCamel: toCamel
  });

  return obj;
})();