/* global */
/* jshint:ignore start */
import event.Emitter as Emitter;
import util.underscore as _;
/* jshint:ignore end */

exports =new (Class(Emitter, function () {
  var _interval,
    started = false,
    listeners = {};

  this.start = function (counter) {
    // you can extend tick by passing a parameter.
    // counter is in second hence the minimum tick is per second.
    _.bindAll(this, 'callListeners');

    if(!started) {
      started = true;
      counter = counter || 100;
      _interval = setInterval(bind(this, this.emit, 'tick'), counter);
    }
    this.on('tick', this.callListeners);
  };

  this.clear = function () {
    started = false;
    listeners = {};
    debugger
    this.removeAllListeners();
    clearInterval(_interval);
  };

  this.unregister = function (listener) {
    // Listener can be a funtion or a string
    if (listeners[listener]) {
      delete listeners[listener];
    }
  };

  this.register = function (tag, listener, tickInterval) {
    tickInterval = tickInterval || 10;
    if(_.isFunction(listener) && !this.has(tag)) {
      if (tag) {
        listeners[tag] = {
          listener: listener,
          _interval: tickInterval,
          _count: 0
        }
      }
    }
  };

  this.getListener = function (tag) {
    return listeners[tag];
  }

  this.once = function (listener) {
  };

  this.has = function (tag) {
    return !!listeners[tag];
  };

  this.callListeners = function () {
    _.each(listeners, function (listener) {
      listener._count += 1;
      if(listener._count >= listener._interval) {
        listener._count = 0;
        listener.listener();
      }
    })
  };
}))();
