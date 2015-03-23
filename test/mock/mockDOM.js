/* global require, global, window, document */

/* @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the Mozilla Public License v. 2.0
 * as published by Mozilla.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Mozilla Public License v. 2.0 for more details.

 * You should have received a copy of the Mozilla Public License v. 2.0
 * along with the Game Closure SDK.  If not, see <http://mozilla.org/MPL/2.0/>.
 */
var jsdom = require('jsdom').jsdom,
  mockCanvas = require('./mockCanvas'),
  mockImage = require('./mockImage'),
  mockAudio = require('./mockAudio'),
  done = false;

exports.setup = function () {
  'use strict';

  var createElement;

  if (done) {
    return;
  }

  global.Image = mockImage.Image;
  global.Audio = mockAudio.Audio;
  global.window = jsdom().parentWindow;
  global.document = window.document;

  global.HTMLCanvasElement = function () {};

  createElement = document.createElement;
  document.createElement = function (element) {
    if (element === 'canvas') {
      return new mockCanvas.Canvas();
    }
    return createElement.apply(document, arguments);
  };

  global.navigator = window.navigator;

  //navigator.userAgent = 'TeaLeaf';

  done = true;
};
