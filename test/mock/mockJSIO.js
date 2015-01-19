/* @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the Mozilla Public License v. 2.0 as published by Mozilla.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Mozilla Public License v. 2.0 for more details.

 * You should have received a copy of the Mozilla Public License v. 2.0
 * along with the Game Closure SDK.  If not, see <http://mozilla.org/MPL/2.0/>.
 */

var fs = require("fs");
var path = require('path');

var done = false;

function addModuleToJSIO(module_path) {
  var package_file = path.join(module_path, 'package.json'),
    package_contents = require(package_file),
    client_paths, current_path, key;

  try {
    package_contents = require(package_file);
    client_paths = package_contents.devkit.clientPaths;
  } catch (e) {
    console.log(e);
    return;
  }

  if (client_paths) {
    for (key in client_paths) {
      current_path = path.join(module_path, client_paths[key]);
      if (key !== '*') {
        jsio.path.add(key, current_path);
      } else {
        jsio.path.add(current_path);
      }
    }
  }
};

exports.setup = function() {
  if (done) {
    return;
  }

  var devkit_path = path.join(__dirname, '../../../devkit-core'),
    jsio_path = path.join(devkit_path, 'node_modules/jsio');

  global.jsio = require(jsio_path);
  jsio.__env.name = 'browser';

  jsio.path.add(path.join(jsio_path, 'packages'));
  addModuleToJSIO(devkit_path);
  addModuleToJSIO(path.join(devkit_path, 'modules/timestep'));
  addModuleToJSIO(path.join(__dirname, '../..'));

  done = true;
};
