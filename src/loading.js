/* Module for Game Closure Devkit to handle loading screen
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global console, Image, ImageView, Loader, _, setTimeout */
/* jshint ignore:start */
import src.Module.image as Image;
import ui.ImageView as ImageView;
import ui.resource.loader as Loader;

import utils.underscore as _;
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
    folders = {
      puzzle: 'resources/images/puzzle_screen',
      powerup: 'resources/images/powerup',
      mapselect: 'resources/images/map_select'
    },
    hourglass = Image.get('menu_screen/loading_hourglass.png'),
    star = Image.get('menu_screen/loading_starburst.png'),

    // Loading screen elements
    view = new ImageView({
      x: 0,
      y: 0,
      image: 'resources/loading/bg.png',
      visible: false,
      inLayout: false,
      zIndex: 3
    }),
    starburst = new ImageView({
      superview: view,
      width: star.getWidth(),
      height: star.getHeight(),
      layout: 'box',
      centerY: true,
      centerX: true,
      centerAnchor: true,
      image: star,
      r: 0
    });
  new ImageView({
    superview: view,
    width: hourglass.getWidth(),
    height: hourglass.getHeight(),
    layout: 'box',
    centerY: true,
    centerX: true,
    offsetX: 66,
    offsetY: 5,
    image: hourglass,
    zIndex: 2
  });

  // star burst animation
  view.tick = function() {
    var r = starburst.style.r;
    // 6.28 = 2 Pi radian
    starburst.style.r = (r + 0.01) % 6.28;
  };

  // method to show loading screen
  obj.show = function(parent, preload, callback) {
    view.updateOpts({
      superview: parent,
      visible: true
    });

    if(preload && _.has(folders, preload)) {
      log('preload ' + preload);
      loading = true;
      Loader.preload(folders[preload], function() {
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
  };

  return obj;
})();
