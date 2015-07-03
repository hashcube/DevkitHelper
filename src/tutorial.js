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
    var view = opts.view;

    currentHead = 0;
    cancel = false;
    this.opts = opts;
    this.views = _.isArray(view) ? view : [view];
    _.each(this.views, bind(this, function (view) {
      view.on('next', bind(this, this.show));
    }));

    tutorials = [];
    if (opts.type) {
      tutorials = this.data[opts.type][opts.milestone] || [];
    }
    if (opts.autostart !== false) {
      this.start();
    }
  };

  this.start = function (forceStart) {
    var opts = this.opts,
      head, id, pos;

    if (tutorials.length > 0) {
      head = tutorials[currentHead];
      id = head.id;
      pos = opts.positions[id];
      this.timeoutID = setTimeout(bind(this, this.launch, forceStart),
        pos.view.timeout || 1000);
    } else if (opts.finish) {
      opts.finish();
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
      head, id, pos, view;

    if (currentHead === 0 || forceStart) {
      if (opts.start) {
        opts.start();
      }
    }

    if (currentHead >= length) {
      head = tutorials[currentHead - 1];
      id = head.id;
      pos = opts.positions[id];
      view = this.views[pos.view.index || 0];

      view.finish(disable, function () {
        var last = tutorials[currentHead - 1];

        if (last.cb) {
          last.cb();
        }
        if (opts.finish) {
          opts.finish();
        }
      });
      return;
    }

    head = tutorials[currentHead++];
    id = head.id;
    pos = opts.positions[id];
    view = this.views[pos.view.index || 0].build(pos.view.params);

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
          width: pos.width,
          height: pos.height,
          text: head.text,
          action: action,
          next: (currentHead < length && !head.hideNext),
          ok: !!head.ok,
          actions: head.actions,
          id: head.id
        });
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
