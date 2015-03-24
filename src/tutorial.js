/* Module for Game Closure Devkit to handle tutorials
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global setTimeout, clearTimeout, device, Emitter, storage */

/* jshint ignore:start */
import event.Emitter as Emitter;
import device;

import .storage as storage;
/* jshint ignore:end */

exports = Class(Emitter, function (supr) {
  'use strict';

  var currentHead = 0,
    tutorials = 0,
    storageID = 'tutorials',
    cancel = false,

    setCompleted = function (id, type, ms) {
      var currentData = storage.get(storageID) || [];
      currentData.push({
        type: type,
        id: id,
        ms: ms
      });
      storage.set(storageID, currentData);
    };

  this.init = function (opts) {
    supr(this, 'init', []);

    this.data = opts.data;
  };

  this.build = function (opts) {
    currentHead = 0;
    cancel = false;
    this.opts = opts;
    this.view = opts.view;
    this.view.on('next', bind(this, this.show));
    tutorials = this.data[opts.type][opts.milestone] || [];
    if (opts.autostart !== false) {
      this.start();
    }
  };

  this.start = function (forceStart) {
    if (tutorials.length > 0) {
      this.timeoutID = setTimeout(bind(this, this.launch, forceStart),
        this.opts.timeout || 1000);
    }
  };

  this.cancel = function () {
    cancel = true;
    clearTimeout(this.timeoutID);
  };

  this.add = function (id, force) {
    var tut = tutorials,
      len = tut.length;

    if (!this.isCompleted(id) && (len === 0 || tut[len - 1].id !== id)) {
      if (this.data[id]) {
        tut.push.apply(tut, this.data[id]);
      }
      if (force) {
        this.start(true);
      }
      return true;
    } else {
      return false;
    }
  };

  this.launch = function (forceStart) {
    if (!cancel) {
      this.show(forceStart);
    }
  };

  this.show = function (forceStart) {
    var view = this.view,
      opts = this.opts,
      disable = opts.disable || false,
      length = tutorials.length;

    if (currentHead === 0 || forceStart) {
      if (opts.start) {
        opts.start();
      }
    }

    if (currentHead >= length) {
      view.finish(disable, opts.finish);
      return;
    }
    var head = tutorials[currentHead++],
      id = head.id,
      pos = opts.positions[id];

    if (pos && !this.isCompleted(id)) {
      var fun = pos.func || 'getPosition',
        param = pos.parameters || [],
        action = pos.action || null,
        context = pos.context || false,
        sub = pos.sub || false,
        x = 0, y = 0,
        inRange = function (size, pos) {
          return pos <= size && pos >= 0;
        };

      if (context) {
        if (sub) {
          context = context[id][sub];
          if (action) {
            action.context = action.context[id][sub];
          }
        }
        pos = context[fun].apply(context, param);
      }

      x = pos.x;
      y = pos.y;
      if (inRange(device.screen.width, x) && inRange(device.screen.height, y)) {
        x += (head.x || 0);
        y += (head.y || 0);

        if (disable) {
          disable.setHandleEvents(false, true);
        }

        view.show({
          superview: opts.superview,
          x: x,
          y: y,
          text: head.text,
          action: action,
          next: (currentHead < length && !head.hideNext),
          ok: !!head.ok
        });
        setCompleted(id, opts.type, head.ms === false ? 0 : opts.milestone);
      } else if (opts.loop) {
        this.build(opts);
      }
    } else {
      view.emit('next');
    }
  };

  this.isCompleted = function (id) {
    var data = storage.get(storageID) || [],
      len = data.length,
      opts = this.opts,
      pos, i;

    for (i = 0; i < len; i++) {
      pos = data[i];
      if (pos.type === opts.type &&
          (pos.ms === 0 || pos.ms === opts.milestone) &&
          pos.id === id) {
        return true;
      }
    }
    return false;
  };
});
