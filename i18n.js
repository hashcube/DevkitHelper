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

  var localize = function (key, params, language) {
    var store, string;

    language = language || GC.app.language || 'en_US';
    params = params || [];

	// if 'resources/languages/' + language + '.json' doesn't exists fallback to en_US language	
	try {
    	store = JSON.parse(CACHE['resources/languages/' + language + '.json']);
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

  parser =  function (message, params) {
    return message.replace(/\$(\d+)/g, function (str, match) {
      var index = parseInt(match, 10) - 1;
      return params[index] !== undefined ? params[index] : '$' + match;
    });
  };

  return localize(key, params, language);
};
