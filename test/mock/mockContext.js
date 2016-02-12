/* @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the Mozilla Public License v. 2.0 as
 * published by Mozilla.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Mozilla Public License v. 2.0 for more details.

 * You should have received a copy of the Mozilla Public License v. 2.0
 * along with the Game Closure SDK.  If not, see <http://mozilla.org/MPL/2.0/>.
 */

exports.Context = function (canvas) {
  'use strict';

  this.canvas = canvas;

  this.getElement = function () {
    return {};
  };
  this.save = function () {};
  this.restore = function () {};
  this.translate = function () {};
  this.beginPath = function () {};
  this.moveTo = function () {};
  this.lineTo = function () {};
  this.closePath = function () {};
  this.fill = function () {};
  this.stroke = function () {};
  this.fillRect = function () {};
  this.strokeRect = function () {};
  this.fillText = function () {};
  this.setTransform = function () {};
  this.clear = function () {};
  this.clearFilter = function () {};
  this.swap = function () {};
  this.strokeText = function () {};
  this.clearRect = function () {};
  this.clipRect = function () {};
  this.clip = function () {};
  this.rect = function () {};
};
