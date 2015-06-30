/* Internationalization module for Game Closure Devkit
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *          Vinod CG <vnodecg@gmail.com>
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global CACHE, GC */

exports = function (key, params, language) {
  'use strict';
  var path = 'resources/languages/';

  language = language || GC.app.language || 'en';

  var localize = function (key, params, language) {
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
      }
    } else if (language !== 'en_US') {
      return localize(key, params, 'en_US');
    }
    return key;
  },
  pluralize = function (message) {
    if (!message) {
      return;
    }

    return message.replace(/\[\[[^\]]+\]\]/g, function (match) {
      var matches = match.replace('[[', '').replace(']]', '').split(','),
        count = parseInt(matches[0].trim(), 10),
        is_more = count > 1,
        word = matches[1].trim(),
        store;

      try {
        store = JSON.parse(CACHE[path + 'plurals_' + language + '.json']);
      } catch (e) {
      }

      if (is_more) {
        if (store && store[word]) {
          word = store[word];
        } else if (language === 'en') {
          word += 's';
        }
      }

      return count + ' ' + word;
    });
  },

  parser =  function (message, params) {
    return message.replace(/\$(\d+)/g, function (str, match) {
      var index = parseInt(match, 10) - 1;
      return params[index] !== undefined ? params[index] : '$' + match;
    });
  };

  return pluralize(localize(key, params, language));
};
