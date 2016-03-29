/* global _ */

/* jshint ignore:start */
import util.underscore as _;
import util.ajax as ajax;
/* jshint ignore:end */

exports = (function (cb) {
  "use strict";

  // When we have multiple services this can be a array to iterate through
  var service_url = 'http://ip-api.com/json';

  ajax.get({
    url: service_url
  }, function (err, res) {
    if (res && _.has(res, "countryCode")) {
      cb(res.countryCode);
    } else {
      cb('UNKNOWN');
    }
  });
});