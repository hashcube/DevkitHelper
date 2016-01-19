/* global _, setInterval, clearInterval, setTimeout, clearTimeout, test, history */

/* jshint ignore:start */
import util.underscore as _;
import .test as test;
import .history as history;
/* jshint ignore:end */

exports = (function () {
  'use strict';

  var mock = null,
    listeners = {},
    obj = {};

  obj.clear = function () {
    obj.unregister(_.keys(listeners));
  };

  obj.unregister = function (tags) {
    tags = _.isArray(tags) ? tags : [tags];
    _.each(tags, function (tag) {
      if (listeners[tag]) {
        clearInterval(listeners[tag].timer);
        delete listeners[tag];
      }
    });
  };

  obj.register = function (tag, callback, interval) {
    interval = mock ? mock : interval;

    if (!listeners[tag]) {
      listeners[tag] = {
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
      var listener = listeners[tag];

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
      listener = listeners[tag];
      if (listener && !listener.is_running) {
        listener.timer = setInterval(listener.callback, listener.interval);
        listener.is_running = true;
      }
    });
  };

  obj.has = function (tag) {
    return !!listeners[tag];
  };

  obj.timeout = function (callback, interval, fast_forward) {
    var timeout_cb = callback,
      timeout_val;

    if (fast_forward) {
      timeout_cb = function () {
        history.pop();
        callback();
      };

      history.add(function (cb) {
        clearTimeout(timeout_val);

        if (cb && cb.fire) {
          cb.fire();
        }
        callback();
      });
    }

    timeout_val = setTimeout(timeout_cb, mock ? mock : interval);

    return timeout_val;
  };

  obj.mock = function (interval) {
    mock = interval;
  };

  test.prepare(obj, {
    listeners: listeners
  });

  return obj;
})();
