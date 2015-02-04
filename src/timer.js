/* global _, setInterval, clearInterval, test*/

/* jshint:ignore start */
import util.underscore as _;
import .test as test;

/* jshint:ignore end */

exports = (function () {
  'use strict';

  var interval,
    listeners = {},
    obj = {};


  obj.clear = function () {
    _.each(listeners, function (val, tag){
      obj.unregister(tag);
    });
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

  obj.register = function (tag, callback, tick_interval) {
    if (!listeners[tag] ) {
      listeners[tag] = {
        callback: callback,
        interval: tick_interval,
        timer: setInterval(callback, tick_interval)
      };
    }
  };

  obj.pause = function (tags) {
    tags = _.isArray(tags) ? tags : [tags];
    _.each(tags, function (tag) {
      if (listeners[tag]) {
        clearInterval(listeners[tag].timer);
      }
    });
  };

  obj.resume = function (tags) {
    var listener;

    tags = _.isArray(tags) ? tags : [tags];
    _.each(tags, function (tag) {
      listener = listeners[tag];
      if (listener) {
        listener.timer = setInterval(listener.callback, listener.interval);
      }
    });
  };

  test.prepare(obj, {
    listeners: listeners
  });

  return obj;
})();
