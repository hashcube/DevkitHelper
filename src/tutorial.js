/* Module for Game Closure Devkit to handle tutorials
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global _, setTimeout, clearTimeout, device, Emitter, storage */

/* jshint ignore:start */
import event.Emitter as Emitter;
import device;

import .storage as storage;
import util.underscore as _;
/* jshint ignore:end */

exports = Class(Emitter, function (supr) {
  'use strict';

  var currentHead = 0,
    tutorials = 0,
    storageID = 'tutorials',
    cancel = false;

  this.init = function (opts) {
    supr(this, 'init', []);

    this.data = opts.data;
  };

  this.build = function (opts) {
    var view = opts.view,
      type = opts.type;

    currentHead = 0;
    cancel = false;
    this.opts = opts;
    this.views = _.isArray(view) ? view : [view];

    tutorials = [];
    if (type && this.data[type]) {
      tutorials = _.filter(this.data[type][opts.milestone] || [],
        bind(this, function (tut) {
          return !this.isCompleted(tut.id);
        }));
    }
    if (opts.autostart !== false) {
      this.start();
    }
  };

  this.start = function (forceStart) {
    var opts = this.opts,
      head, id, pos, timeout;

    if (tutorials.length > 0) {
      head = tutorials[currentHead];
      id = head.id;
      pos = opts.positions[id];
      if (opts.before) {
        opts.before();
      }
      timeout = pos.view.timeout;
      this.timeoutID = setTimeout(bind(this, this.launch, forceStart),
        _.isNumber(timeout) ? timeout : 1000);
    }
  };

  this.cancel = function () {
    cancel = true;
    clearTimeout(this.timeoutID);
  };

  this.add = function (id, force, cb) {
    var tut = tutorials,
      len = tut.length,
      data;

    if (!this.isCompleted(id) && (len === 0 || tut[len - 1].id !== id)) {
      data = this.data[id];

      if (data) {
        _.last(data).cb = cb;
        tut.push.apply(tut, data);

        if (force) {
          this.start(true);
        }
        return true;
      }
    }
    return false;
  };

  this.launch = function (forceStart) {
    if (!cancel) {
      this.show(forceStart);
    }
  };

  this.show = function (forceStart) {
    var opts = this.opts,
      disable = opts.disable || false,
      length = tutorials.length,
      head, id, pos, view, completed;

    if (currentHead === 0 || forceStart) {
      if (opts.start) {
        opts.start();
      }
    }

    if (currentHead > 0) {
      head = tutorials[currentHead - 1];
      completed = currentHead >= length;

      if (head.finish_immediate || completed) {
        id = head.id;
        pos = opts.positions[id];
        view = this.views[pos.view.index || 0];

        view.finish(disable, function () {
          if (head.cb) {
            head.cb();
          }
          if (completed && opts.finish) {
            opts.finish();
          }
        });
      }

      if (completed) {
        return;
      }
    }

    head = tutorials[currentHead++];
    id = head.id;
    pos = opts.positions[id];
    view = this.views[pos.view.index || 0].build(pos.view.params);
    view.once('next', bind(this, this.show));

    if (pos) {
      var fun = pos.func || 'getPosition',
        param = pos.parameters || [],
        action = pos.action || null,
        context = pos.context || false,
        sub = pos.sub || false,
        x = 0, y = 0,
        onScreen = function (pos) {
          var x = pos.x,
            y = pos.y,
            height = pos.height || 0,
            width = pos.width || 0,
            cords = [
              [x, y], [x + width, y], [x, y + height], [x + width, y + height]
            ],
            inRange = function (size, pos) {
              return pos <= size && pos >= 0;
            };

          return _.find(cords, function (curr) {
            return inRange(device.screen.width, curr[0]) && inRange(device.screen.height, curr[1])
          });
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
      if (onScreen(pos)) {
        x += (head.x * pos.scale || 0);
        y += (head.y * pos.scale || 0);

        if (disable) {
          disable.setHandleEvents(false, true);
        }

        view.show(merge({
          superview: opts.superview,
          x: x,
          y: y,
          width: pos.width,
          height: pos.height,
          text: head.text,
          action: action,
          next: (currentHead < length && !head.hideNext),
          ok: !!head.ok
        }, head));
        this.setCompleted(opts.type, id,
          head.ms === false ? 0 : opts.milestone);
      } else if (opts.loop) {
        this.build(opts);
      }
    } else {
      view.emit('next');
    }
  };

  this.resetTutorial = function (id) {
    var tutorial_data = storage.get(storageID);

    tutorial_data = _.reject(tutorial_data, function (obj) {
      return obj.type === id;
    });

    storage.set(storageID, tutorial_data);
  };

  this.setCompleted = function (type, id, ms) {
    storage.push(storageID, {
      type: type,
      id: id,
      ms: ms
    });
  };

  this.isCompleted = function (id, params) {
    var data = storage.get(storageID) || [],
      len = data.length,
      opts = params || this.opts,
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

  this.clean = function () {
    _.each(this.views, bind(this, function (view) {
      view.removeAllListeners('next');
    }));
  };
});
