/* global _, setInterval, clearInterval, setTimeout, clearTimeout, test */

/* jshint ignore:start */
import util.underscore as _;
import .test as test;
/* jshint ignore:end */

exports = (function () {
  'use strict';

  var mock = null,
    listeners_interval = {},
    listeners_timeout = {},
    obj = {};

  obj.clear = function () {
    obj.unregister(_.keys(listeners_interval));
    obj.clearTimeout(_.keys(listeners_timeout));
  };

  obj.unregister = function (tags) {
    tags = _.isArray(tags) ? tags : [tags];
    _.each(tags, function (tag) {
      if (listeners_interval[tag]) {
        clearInterval(listeners_interval[tag].timer);
        delete listeners_interval[tag];
      }
    });
  };

  obj.register = function (tag, callback, interval) {
    interval = mock ? mock : interval;

    if (!listeners_interval[tag]) {
      listeners_interval[tag] = {
        callback: callback,
        interval: interval,
        timer: setInterval(callback, interval),
        is_running: true
      };
    }
  };

  obj.pause = function (tags) {
    tags = _.isArray(tags) ? tags : [tags];
    _.each(tags, function (tag) {
      var listener = listeners_interval[tag];

      // no need to clear interval if timer is not running
      if (listener && listener.is_running) {
        clearInterval(listener.timer);
        listener.is_running = false;
      }
    });
  };

  obj.resume = function (tags) {
    var listener;

    tags = _.isArray(tags) ? tags : [tags];
    _.each(tags, function (tag) {
      listener = listeners_interval[tag];
      if (listener && !listener.is_running) {
        listener.timer = setInterval(listener.callback, listener.interval);
        listener.is_running = true;
      }
    });
  };

  obj.has = function (tag) {
    return !!listeners_interval[tag];
  };

  obj.hasTimeout = function (tag) {
    return !!listeners_timeout[tag];
  };

  obj.clearTimeout = function (tags) {
    tags = _.isArray(tags) ? tags : [tags];
    _.each(tags, function (tag) {
      if (listeners_timeout[tag]) {
        clearTimeout(listeners_timeout[tag].timer);
        delete listeners_timeout[tag];
      }
    });
  };

  obj.timeout = function (tag, callback, milliseconds) {
    var cb;

    if (!tag) {
      return setTimeout(callback,  mock ? mock : milliseconds);
    }

    if (!listeners_timeout[tag]) {
      cb = function () {
        clearTimeout(listeners_timeout[tag].timer);
        delete listeners_timeout[tag];

        callback();
      };
      listeners_timeout[tag] = {
        callback: cb,
        timer: setTimeout(cb,  mock ? mock : milliseconds)
      };
    }
  };

  obj.callImmediate = function (tag) {
    var listener = listeners_timeout[tag];

    if (listener) {
      listeners_timeout[tag].callback();
    }
  };

  obj.mock = function (interval) {
    mock = interval;
  };

  test.prepare(obj, {
    listeners_interval: listeners_interval
  });

  return obj;
})();
