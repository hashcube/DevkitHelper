/* global _, setInterval, clearInterval*/

/* jshint:ignore start */
import util.underscore as _;
/* jshint:ignore end */

exports = (function () {
  'use strict';

  var interval,
    listeners = {},
    obj = {};

  obj.clear = function () {
    _.each(listeners, function (listener){
      clearInterval(listener.timer);
    });
    listeners = {};
  };

  obj.unregister = function (tag) {
    if (listeners[tag]) {
      clearInterval(listeners[tag].timer);
      listeners[tag].timer = false;
    }
  };

  obj.register = function (tag, callback, tick_interval) {
    if(!this.has(tag)){
      listeners[tag] = {
        callback: callback,
        interval: tick_interval,
        timer: setInterval(callback, tick_interval)
      };
    }
  };

  obj.has = function (tag) {
    if(listeners[tag]) {
      return !!listeners[tag].timer;
    }
    return false;
  };

  obj.pause = function (tag) {
    if(listeners[tag]){
      clearInterval(listeners[tag].timer);
    }
  };

  obj.resume = function (tag) {
    var listener = listeners[tag];

    if(listener){
      listener.timer = setInterval(listener.callback, listener.interval);
    }
  };

  return obj;
})();
