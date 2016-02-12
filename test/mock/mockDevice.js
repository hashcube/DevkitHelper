/* @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the Mozilla Public License v. 2.0 as published by
 * Mozilla.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Mozilla Public License v. 2.0 for more details.

 * You should have received a copy of the Mozilla Public License v. 2.0
 * along with the Game Closure SDK.  If not, see <http://mozilla.org/MPL/2.0/>.
 */

/* global exports, device, require, jsio */

require('./mockJSIO').setup();
require('./mockDOM').setup();

exports.setup = function () {
  'use strict';

  var mockCanvas = require('./mockCanvas'),
    cache_get;

  jsio('import device as device');
  cache_get = device.get;
  device.get = function (module) {
    if (module === 'Canvas') {
      return mockCanvas.Canvas;
    } else {
      return cache_get(module);
    }
  };
  device.width = 640;
  device.height = 480;
  device.canResize = false;
  device.isMobile = false;
  device.setBackButtonHandler = function () {};
};
