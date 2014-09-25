/* Model module for Devkit
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *          Debarko De <debarko89@gmail.com>
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global Emitter, _, localStorage */

/* jshint ignore:start */
import event.Emitter as Emitter;

import util.underscore as _;
/* jshint ignore:end */

exports = Class(Emitter, function (supr) {
  'use strict';

  this.init = function () {
    supr(this, 'init', arguments);

    this._attributes = {};
    this._previousAttributes = {};

    return this;
  };

  this.set = function (key, val, silent) {
    var attr, attrs, current, prev;

    // arguments can be in `"key", value` or `{key: value}` style
    if (_.isObject(key)) {
      attrs = key;
      silent = val;
    } else {
      (attrs = {})[key] = val;
    }

    current = this._attributes;
    prev = this._previousAttributes;

    for (attr in attrs) {
      val = attrs[attr];
      if (!_.isEqual(current[attr], val)) {
        prev[attr] = current[attr];
        current[attr] = val;
        if (!silent) {
          this.emit('change:' + attr, val);
        }
      }
    }
    return this;
  };

  this.unset = function (key) {
    delete this._attributes[key];
    this.emit('change:' + key);
    return this;
  };

  this.has = function (key) {
    return this._attributes[key] !== undefined;
  };

  this.get = function (key, clone) {
    var val;
    if (!key) {
      val = this._attributes;
    } else {
      val = this._attributes[key];
    }
    if (clone) {
      return this.clone(val);
    }
    return val;
  };

  this.getPrevious = function (key) {
    return this._previousAttributes[key];
  };

  this.save = function () {
    var id = this.get('id');
    if (id) {
      localStorage.setItem(id, JSON.stringify(this.get()));
    }
    return this;
  };

  this.load = function (id, silent) {
    var data;
    try {
      data = JSON.parse(localStorage.getItem(id));
    } catch (e) {
      return;
    }
    this.set(data, silent);
    return this;
  };

  this.clone = function (obj) {
    var copy, i, attr, len;

    if (_.isDate(obj)) {
      // Handle Date
      copy = new Date();
      copy.setTime(obj.getTime());
    } else if (_.isArray(obj)) {
      // Handle Array
      copy = [];
      for (i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.clone(obj[i]);
      }
    } else if (_.isObject(obj)) {
      // Handle Object
      copy = {};
      for (attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = this.clone(obj[attr]);
        }
      }
    } else {
      copy = obj;
    }
    return copy;
  };

  this.increment = function (key, val, silent) {
    if (!_.isNumber(val)) {
      silent = val;
      val = 1;
    }
    val += this.get(key);
    this.set(key, val, silent);
    return val;
  };

  this.decrement = function (key, val, silent) {
    if (!_.isNumber(val)) {
      silent = val;
      val = 1;
    }
    val = this.get(key) - val;
    this.set(key, val, silent);
    return val;
  };

  // array operations
  this.push = function (key, val) {
    var current = this.get(key);

    current.push(val);
    this.set(key, current);
    return current;
  };

  this.pop = function (key) {
    var data = this.get(key),
      val = data.pop();

    this.set(key, data);
    return val;
  };

  this.shift = function (key) {
    var data = this.get(key),
      val = data.shift();

    this.set(key, data);
    return val;
  };

  this.destroy = this.onRelease = function () {
    this._attributes = {};
    this._previousAttributes = {};
    this.removeAllListeners();
  };

});
