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
  }, modules = {};

  test.prepare(this, {
    setJSIO: function (fn) {
      jsio = fn;
    },
    toCamel: toCamel
  });

  this.register = function (path, plugins) {
    this.plugins = plugins;
    plugins.forEach(function (plugin) {
      modules[plugin] = jsio('import ' + path + '.' + plugin + ' as ' + plugin);
    });
  };

  this.emit = function (signal, data) {
    this.plugins.forEach(function (plugin) {
      if (typeof modules[plugin][toCamel(signal)] === 'function') {
        modules[plugin][toCamel(signal)](data);
      }
    });
  };
}());