/* global global, jsio, _, setTimeout */

jsio('import util.underscore as _');

exports = {
  removeFromJSIOCache: function (file_name) {
    'use strict';

    var to_remove,
      cache_modules = global.jsio.__modules;

    if (file_name && cache_modules) {
      to_remove = _.find(_.keys(cache_modules), function (key) {
        return (key.indexOf(file_name) !== -1);
      });

      if (to_remove) {
        delete cache_modules[to_remove];
      }
    }
  },
  assertSignal: function (done, obj, signal, test, time) {
    /*Params
      done : done from mocha
      obj: object on which signal emits
      signal: name of signal emitted
      test: true if signal must emit false otherwise
      time: how long will it take for signal to emit
    */
    'use strict';

    var status = false;

    obj.on(signal, function () {
      status = true;
    });
    setTimeout(function () {
      if (status === test) {
        done();
      } else {
        done(signal + ' test failed');
      }
    }, time || 10);
  }
};
