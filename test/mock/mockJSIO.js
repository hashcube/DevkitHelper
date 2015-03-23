/* global require, __dirname, global, console */

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

var fs = require('fs'),
  path = require('path'),
  done = false;

function scanModules() {
  'use strict';

  var module_path = path.join(__dirname, '../../modules'),
    module_dirs = fs.readdirSync(module_path),
    current_dir, current_path;

  while (module_dirs[0]) {
    current_dir = module_dirs.shift();
    current_path = path.join(module_path, current_dir);
    if (current_dir === 'build') {
      continue;
    } else if (current_dir === 'devkit-core') {
      addModuleToJSIO(current_path);
      // scanning timestep module of devkit only
      current_path = path.join(current_path, 'modules/timestep');
    }
    addModuleToJSIO(current_path);
  }
}

function addModuleToJSIO(module_path) {
  'use strict';

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
}

exports.setup = function () {
  'use strict';

  if (done) {
    return;
  }

  var jsio_path = path.join(__dirname,
    '../../modules/devkit-core/node_modules/jsio');

  global.jsio = require(jsio_path);
  jsio.__env.name = 'browser';

  jsio.path.add(path.join(jsio_path, 'packages'));
  jsio.path.add('.');
  scanModules();

  done = true;
};
