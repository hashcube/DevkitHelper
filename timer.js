/* global Emitter, _*/

/* jshint:ignore start */
import event.Emitter as Emitter;
import util.underscore as _;
/* jshint:ignore end */

exports = (function () {
  'use strict';

  var interval,
    started = false,
    listeners = {};

  this.start = function (counter) {
    // you can extend tick by passing a parameter.
    // counter is in second hence the minimum tick is per second.
    _.bindAll(this, 'callListeners');

    if(!started) {
      started = true;
      counter = counter || 1;
      interval = setInterval(bind(this, this.callListeners), counter);
    }
  };

  this.clear = function () {
    started = false;
    listeners = {};
    clearInterval(interval);
  };

  this.unregister = function (tag) {
    // Listener can be a funtion or a string
    if (listeners[tag]) {
      delete listeners[tag];
    }
  };

  this.register = function (ctx, tag, callback, tick_interval, once) {
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

  this.getListener = function (tag) {
    return listeners[tag];
  }

  this.has = function (tag) {
    return !!listeners[tag];
  };

  this.callListeners = function () {
    _.each(listeners, bind(this, function (listener, tag) {
      listener.count += 1;
      if(listener.count >= listener.interval) {
        listener.count = 0;
        bind(listener.ctx, listener.callback)();
        if (listener.once) {
          this.unregister(tag);
        }
      }
    }));
  };

  this.once = function (ctx, tag, callback, interval) {
    this.register(ctx, tag, callback, interval, true);
  };

  return this;
})();
