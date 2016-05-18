/* global _ */

/* jshint ignore:start */
import util.underscore as _;
import util.ajax as ajax;
/* jshint ignore:end */

exports = (function (cb) {
  "use strict";

  // When we have multiple services this can be a array to iterate through
  var service_url = [
                    ['country_code', 'http://freegeoip.net/json/'],
                    ['countryCode', 'http://ip-api.com/json']
                    ],
    it = 0,
    ajax_req = function () {
      ajax.get({
        url: service_url[it][1]
      }, function (err, res) {
        if (res && _.has(res, service_url[it][0])) {
          cb(res[service_url[it][0]]);
          return;
        } else if (it < service_url.length - 1){
          ++it;
          ajax_req();
        } else {
          cb("UNKNOWN");
          return;
        }
      });
    };

  ajax_req();
});