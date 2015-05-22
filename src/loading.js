/* Module for Game Closure Devkit to handle loading screen
 * This module makes use of StackView signals.
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>, Bijosh T J <bijoshtj@gmail.com>
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global console, loader, _, setTimeout, test */
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
    log = function(msg) {
      if(debug) {
        console.log('loading:', msg);
      }
    },
    // folders to pre-load
    folders,
    view;

  obj.initialize = function (view_obj, folders_obj) {
    view = view_obj;
    folders = folders_obj ? folders_obj : {};

    test.prepare(this, {
      view: view,
      folders: folders
    });
  };

  // method to show loading screen
  obj.show = function(parent, preload, callback) {
    if (!view) {
      return false;
    }

    // disable back button
    history.setBusy();

    view.emit('loading:show');
    view.updateOpts({
      superview: parent,
      visible: true
    });

    if(preload && _.has(folders, preload)) {
      log('preload ' + preload);
      loading = true;
      loader.preload(folders[preload], function() {
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
    if (!view) {
      return false;
    }
    // if images are still loading, call this function again
    if(loading === true) {
      log('flag is ' + loading);
      setTimeout(obj.hide, 1);
      return;
    }

    log('flag is ' + loading);
    view.removeFromSuperview();
    view.updateOpts({
      visible: false
    });

    // reset backbutton
    history.resetBusy();
    view.emit('loading:hide');
  };

  return obj;
})();
