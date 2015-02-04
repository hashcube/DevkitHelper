/* Module for Game Closure Devkit to handle loading screen
 * This module makes use of StackView signals.
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global console, Image, ImageView, loader, _, setTimeout */
/* jshint ignore:start */
import ui.resource.Image as Image;
import ui.ImageView as ImageView;
import ui.resource.loader as loader;

import util.underscore as _;

import .history as history;
import .test as test;
/* jshint ignore:end */

exports = (function() {
  'use strict';

  var obj = {},
    debug = false,
    loading = false,
    initialized = false,
    log = function(msg) {
      if(debug) {
        console.log('loading:', msg);
      }
    },
    // folders to pre-load
    _folders,
    _view;

  obj.initialize = function (view, folders) {
    _view = view;
    _folders = folders ? folders : {};
    initialized = true;

    test.prepare(this, {
      view: _view,
      folders: _folders,
      initialized: initialized
    });
  };

  // method to show loading screen
  obj.show = function(parent, preload, callback) {
    if (!initialized) {
      return false;
    }
    _view.updateOpts({
      superview: parent,
      visible: true
    });

    if(preload && _.has(_folders, preload)) {
      log('preload ' + preload);
      loading = true;
      loader.preload(_folders[preload], function() {
        loading = false;
      });
    } else {
      log('no preload');
      loading = false;
    }

    // method to hide loading screen
    parent.once('ViewDidDisappear', this.hide);

    if(callback) {
      _.defer(_.bind(callback, parent));
    }
  };

  // No need to call this, unless you want to hide manually.
  obj.hide = function() {
    if (!initialized) {
      return false;
    }
    // if images are still loading, call this function again
    if(loading === true) {
      log('flag is ' + loading);
      setTimeout(obj.hide, 1);
      return;
    }

    log('flag is ' + loading);
    _view.removeFromSuperview();
    _view.updateOpts({
      visible: false
    });
  };

  return obj;
})();
