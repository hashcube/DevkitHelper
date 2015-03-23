/* global global, jsio, Application, setInterval */

/* jshint ignore:start */
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
/* jshint ignore:end */

exports.setup = function () {
  'use strict';

  var lastTime, time;

  global.navigator = {language: 'en'};
  global.NATIVE = {};
  jsio('import ui.Engine as Application');
  global.app = new Application();

  global.CACHE = {};
  global.DEBUG = true;
  global.DEV_MODE = true;

  lastTime = +new Date();
  setInterval(
    function () {
      time = +new Date();
      global.app._tick(time - lastTime);
      lastTime = time;
    },
    50
  );
};
