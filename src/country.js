/* global _, ajax, Callback */

/* jshint ignore:start */
import lib.Callback as Callback;
import util.underscore as _;
import util.ajax as ajax;
/* jshint ignore:end */

exports = function (callback) {
  "use strict";

  var cbs = [],
    sites = [
      ['https://ipapi.co/json/', 'country'],
      ['http://ip-api.com/json', 'countryCode']
    ],

    request = function (url, key, next) {
      cbs.shift();
      ajax.get({url: url}, function (err, res) {
        next(res && _.has(res, key) ? res[key] : null);
      });
    },

    next = function (country) {
      var pop = cbs.shift();

      if (!country && pop) {
        pop.fire();
      } else {
        callback(country || 'UNKNOWN');
      }
    };

  _.each(sites, function (site) {
    var cb = new Callback();

    cbs.push(cb);
    cb.run(null, request, site[0], site[1], next);
  });

  cbs[0].fire();
};
