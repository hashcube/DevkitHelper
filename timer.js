/* global _, setInterval, clearInterval*/

/* jshint:ignore start */
import util.underscore as _;
/* jshint:ignore end */

exports = (function () {
  'use strict';

  var interval,
    started = false,
    listeners = {},
    obj = {},
    timer_length = 100;

  obj.start = function (counter) {
    if(!started) {
      started = true;
      timer_length = counter ? counter * timer_length: timer_length;
      interval = setInterval(obj.callListeners, timer_length);
    }
  };

  obj.clear = function () {
    started = false;
    listeners = {};
    // default is set to 100 to reduce number of calculations per sec
    timer_length = 100;
    clearInterval(interval);
  };

  obj.unregister = function (tag) {
    // Listener can be a function or a string
    if (listeners[tag]) {
      delete listeners[tag];
    }
  };

  obj.register = function (ctx, tag, callback, tick_interval, once) {
    tick_interval = tick_interval / 100 || 10; // default to 1s
    listeners[tag] = {
      callback: callback,
      interval: tick_interval,
      count: 0,
      once: once,
      ctx: ctx
    };
  };

  obj.getListener = function (tag) {
    return listeners[tag];
  }

  obj.has = function (tag) {
    return !!listeners[tag];
  };

  obj.callListeners = function () {
    _.each(listeners, function (listener, tag) {
      listener.count += 1;
      if(listener.count >= listener.interval) {
        listener.count = 0;
        listener.callback.apply(listener.ctx);
        if (listener.once) {
          obj.unregister(tag);
        }
      }
    });
  };

  obj.pause = function () {
    clearInterval(interval);
    started = false;
  };

  obj.once = function (ctx, tag, callback, interval) {
    this.register(ctx, tag, callback, interval, true);
  };

  return obj;
})();
