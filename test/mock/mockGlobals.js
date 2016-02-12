/* global global, require, ui */

var path = require('path');

exports.setup = function () {
  'use strict';

  jsio('import ui.StackView');

  global.abs_path = path.resolve('.');

  global.GC = {
    Application: ui.StackView,
    plugins: {
      register: function () {}
    }
  };

  global.NATIVE = {
    events: {
      registerHandler: function () {}
    },
    plugins: {
      sendEvent: function () {}
    }
  };

  global.localStorage = {
    setItem: function () {},
    getItem: function () {},
    removeItem: function () {},
    clear: function () {}
  };

  global.GC.app = {};
};
