/* Module for Game Closure Devkit to handle tutorials
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global _, setTimeout, clearTimeout, device, Emitter, storage, history */

/* jshint ignore:start */
import event.Emitter as Emitter;
import device;

import .history as history;
import .storage as storage;
import util.underscore as _;
/* jshint ignore:end */

exports = Class(Emitter, function (supr) {
  'use strict';

  var currentHead = 0,
    tutorials = 0,
    storageID = 'tutorials',
    cancel = false,
    getGroupId = function (data, tut_id) {
      return _.find(data, function (tut_obj) {
          return tut_obj.id === tut_id;
        }).group;
    },
    getGroup = function (data, group_id) {
      return _.map(_.filter(data, function (tut_obj) {
          return tut_obj.group === group_id;
        }), function (tut_obj) {
          return tut_obj.id;
        });
    },
    curr_view = null;

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

      if (opts.on_cancel) {
        history.add(opts.on_cancel);
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

  this.add = function (id, force, cb, opts) {
    var tut = tutorials,
      len = tut.length,
      data;

    if (!this.isCompleted(id) && (len === 0 || tut[len - 1].id !== id)) {
      data = this.data[id];

      if (data) {
        this.opts = merge(opts || {}, this.opts);
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
      head, id, pos, view, completed, before;

    if (currentHead === 0 || forceStart) {
      if (opts.start) {
        opts.start();
      }
    }

    if (currentHead > 0) {
      head = tutorials[currentHead - 1];
      completed = currentHead >= length;
      id = head.id;
      pos = opts.positions[id];

      if (pos.after) {
        pos.after();
      }

      if (head.finish_immediate || completed) {
        view = this.views[pos.view.index || 0];

        view.finish(disable, function () {
          if (head.cb) {
            head.cb();
          }
          if (completed && opts.finish) {
            opts.finish();
            view.emit('finished');
          }
        });
      }

      if (completed) {
        if (opts.on_cancel) {
          history.pop();
        }

        return;
      }
    }

    head = tutorials[currentHead++];
    id = head.id;
    pos = opts.positions[id];
    before = pos.before;
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
            return inRange(device.screen.width, curr[0]) && inRange(device.screen.height, curr[1]);
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

      x = pos.x / pos.scale;
      y = pos.y / pos.scale;
      if (onScreen(pos)) {
        x += (head.x * pos.scale || 0);
        y += (head.y * pos.scale || 0);

        if (disable) {
          disable.setHandleEvents(false, true);
        }

        if (before) {
          before();
        }

        view.show(merge({
          superview: opts.superview,
          x: x || 0,
          y: y || 0,
          width: pos.width / pos.scale,
          height: pos.height / pos.scale,
          view: context,
          text: head.text,
          action: action,
          next: (currentHead < length && !head.hideNext),
          ok: !!head.ok
        }, head), head.timeout);
        curr_view = view;
        if (!head.always_show) {
          this.setCompleted(opts.type, id,
            head.ms === false ? 0 : opts.milestone);
        }
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
    var completed_data = storage.get(storageID) || [],
      curr_data = {
        type: type,
        id: id,
        ms: ms
      };

    if (_.find(completed_data, function (curr_tut) {
        return _.isEqual(curr_data, curr_tut);
      })) {
      return;
    }

    storage.push(storageID, curr_data);
  };

  this.getTutorialsHavingSameGroup = function (type, milestone, tut_id) {
    var curr_data = (type && this.data[type]) ? this.data[type][milestone] : null,
      curr_group = curr_data ? getGroupId(curr_data, tut_id) : null;

    return curr_group ? getGroup(curr_data, curr_group) : [tut_id];
  };

  this.isCompleted = function (id, params) {
    var completed_data = storage.get(storageID) || [],
      len = completed_data.length,
      opts = params || this.opts,
      current_group_tuts = this.getTutorialsHavingSameGroup(opts.type, opts.milestone, id),
      completed_groups = [],
      pos, i;

    for (i = 0; i < len; i++) {
      pos = completed_data[i];
      if (pos.type === opts.type &&
          (pos.ms === 0 || pos.ms === opts.milestone) &&
          _.contains(current_group_tuts, pos.id)) {
        completed_groups.push(pos.id);
        if (current_group_tuts.length === completed_groups.length) {
          return true;
        }
      }
    }
    return false;
  };

  this.pause = function () {
    if (!curr_view || !curr_view.getSuperview()) {
      return;
    }

    if (curr_view.onPause) {
      curr_view.onPause();
    }

    curr_view.setHandleEvents(false, true);
    curr_view.hide();
  };

  this.resume = function () {
    var opts = this.opts;

    if (!curr_view || !curr_view.getSuperview()) {
      return;
    }

    if (opts.on_cancel) {
      history.add(opts.on_cancel);
    }

    curr_view.setHandleEvents(true, false);

    if (curr_view.onResume) {
      curr_view.onResume();
    }

    curr_view.show();
  };

  this.clean = function () {
    _.each(this.views, bind(this, function (view) {
      view.removeAllListeners('next');
      if (view.clean) {
        view.clean();
      }
    }));
  };
});
