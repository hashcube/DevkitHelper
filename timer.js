/* global _*/

/* jshint:ignore start */
import util.underscore as _;
/* jshint:ignore end */

exports = (function () {
  'use strict';

  var interval,
    started = false,
    listeners = {},
    obj = {};
  obj.start = function (counter) {
    if(!started) {
      started = true;
      counter = counter || 1;
      interval = setInterval(bind(this, this.callListeners), counter);
    }
  };

  obj.clear = function () {
    started = false;
    listeners = {};
    clearInterval(interval);
  };

  obj.unregister = function (tag) {
    // Listener can be a funtion or a string
    if (listeners[tag]) {
      delete listeners[tag];
    }
  };

  obj.register = function (ctx, tag, callback, tick_interval, once) {
    tick_interval = tick_interval || 1000; // default to 1s
    if (tag) {
      listeners[tag] = {
        callback: callback,
        interval: tick_interval,
        count: 0,
        once: once,
        ctx: ctx
      }
    }
  };

  obj.getListener = function (tag) {
    return listeners[tag];
  }

  obj.has = function (tag) {
    return !!listeners[tag];
  };

  obj.callListeners = function () {
    _.each(listeners, bind(this, function (listener, tag) {
      listener.count += 1;
      if(listener.count >= listener.interval) {
        listener.count = 0;
        listener.callback.apply(listener.ctx);
        if (listener.once) {
          this.unregister(tag);
        }
      }
    }));
  };

  obj.once = function (ctx, tag, callback, interval) {
    this.register(ctx, tag, callback, interval, true);
  };

  return obj;
})();
