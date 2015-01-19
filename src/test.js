/* global process, _ */

/* jshint ignore:start */
import util.underscore as _;
/* jshint ignore:end */

exports = (function () {
  'use strict';

  var obj = {};

  // function to check whether env variable is set
  obj.isTestEnv = function () {
    if (typeof process !== 'undefined' &&
        process.env && process.env.NODE_ENV === 'test') {
      return true;
    }
    return false;
  };

  obj.prepare = function (context, fns) {
    if (obj.isTestEnv()) {
      _.each(fns, function (fn, key) {
        // _ to denote that property is private
        context['_' + key] = fn;
      });
    }
  };

  return obj;
})();
