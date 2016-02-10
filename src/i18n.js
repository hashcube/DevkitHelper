
/* Internationalization module for Game Closure Devkit
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *          Vinod CG <vnodecg@gmail.com>
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global CACHE, GC */

import util.underscore as _;

exports = function (key, params, language) {
  'use strict';
  var path = 'resources/languages/',
    localize, pluralize, parser;

  language = language || GC.app.language || 'en';

  localize = function (key, params, language) {
    var store, string;

    params = params || [];

    // if language.json doesn't exists fallback to en_US
    try {
      store = JSON.parse(CACHE[path + language + '.json']);
    } catch (err) {
    }

    if (store) {
      string = store[key];
      if (string) {
        return parser(string, params);
      } else {
        return localize(key, params, 'en');
      }
    } else if (language !== 'en') {
      return localize(key, params, 'en');
    }
    return key;
  };

  pluralize = function (message) {
    if (!message) {
      return;
    }

    return message.replace(/{{[^}}]*}}/g, function (match) {
      var matches = match.replace('{{', '').replace('}}', '').split('|'),
        val = matches[0].trim(),
        length = matches.length,
        values = {},
        result;

      for (var i = 1; i < length; i++) {
        var words = matches[i].split(':');

        if (words.length === 2) {
          values[words[0].trim()] = words[1].trim();
        } else {
          result = 'i18n: There\'s an error in the format (n:string)';
          return result;
        }
      }

      if (_.isUndefined(values[val])) {
        result = matches[length - 1].trim();
        result = result.split(':')[1].trim();
      } else {
        result = values[val].trim();
      }

      return result;
    });
  };

  parser =  function (message, params) {
    return message.replace(/\$(\d+)/g, function (str, match) {
      var index = parseInt(match, 10) - 1;
      return params[index] !== undefined ? params[index] : '$' + match;
    });
  };

  return pluralize(localize(key, params, language));
};
