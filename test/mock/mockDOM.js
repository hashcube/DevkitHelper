/* global require, global, window */

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
  mockImage = require('./mockImage'),
  mockAudio = require('./mockAudio'),
  done = false;

exports.setup = function () {
  'use strict';

  if (done) {
    return;
  }

  global.Image = mockImage.Image;
  global.Audio = mockAudio.Audio;
  global.window = jsdom().defaultView;
  global.document = window.document;

  global.HTMLCanvasElement = function () {};

  window.navigator.language = 'en-US';
  global.navigator = window.navigator;

  done = true;
};
