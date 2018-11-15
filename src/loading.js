/* Module for Game Closure Devkit to handle loading screen
 * This module makes use of StackView signals.
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>, Bijosh T J <bijoshtj@gmail.com>
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global GC, console, Emitter, loader, _, setTimeout, test, history */
/* jshint ignore:start */
import event.Emitter as Emitter;

import ui.resource.loader as loader;

import util.underscore as _;

import .history as history;
import .test as test;
/* jshint ignore:end */

exports = new (Class(Emitter, function () { // jshint ignore:line
  'use strict';

  var debug = false,
    loading = false,
    log = function (msg) {
      if (debug) {
        console.log('loading:', msg);
      }
    },

    // folders to pre-load
    folders,
    view;

  this.initialize = function (loading_view, cache) {
    folders = cache ? cache : {};
    view = loading_view;

    _.bindAll(this, 'show', 'hide');

    test.prepare(this, {
      view: view,
      folders: folders
    });
  };

  // method to show loading screen
  this.show = function (preload, callback) {
    // disable back button
    history.setBusy();
    this.emit('show');
    view.updateOpts({
      superview: GC.app,
      zIndex: 10,
      visible: true
    });

    if (preload && _.has(folders, preload)) {
      log('preload ' + preload);
      loading = true;
      loader.preload(folders[preload], function () {
        loading = false;
      });
    } else {
      log('no preload');
      loading = false;
    }

    // method to hide loading screen
    GC.app.on('StackChanged', this.hide);

    if (callback) {
      _.defer(callback);
    }
  };

  this.update = function (cache) {
    folders = cache;
  };

  // No need to call this, unless you want to hide manually.
  this.hide = function () {
    // if images are still loading, call this function again
    if (loading === true) {
      log('flag is ' + loading);
      setTimeout(this.hide, 1);
      return;
    }
    log('flag is ' + loading);
    GC.app.removeListener('StackChanged', this.hide);
    view.removeFromSuperview();
    view.updateOpts({
      visible: false
    });

    // reset backbutton
    history.resetBusy();
    this.emit('hide');
  };
}))();
