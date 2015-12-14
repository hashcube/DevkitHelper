/* global navigator, storage, ajax */

/* jshint ignore: start */
import .storage as storage;
import util.ajax as ajax;
/* jshint ignore: end */

exports = (function () {
  'use strict';

  var err_url,
    send_progress = false,
    storage_id = 'game_errors',
    obj = {},
    device_info = {},
    onSend = function (err) {
      if (!err) {
        storage.del(storage_id);
      }

      send_progress = false;
    },
    sendToServer = function () {
      var errors = storage.get(storage_id) || [];

      if (errors.length === 0 || !navigator.onLine || send_progress) {
        return;
      }

      send_progress = true;
      ajax.post({
        url: err_url,
        data: {
          user: GC.app.user.get('uid'),
          device: device_info,
          errors: errors
        }
      }, onSend)
    },
    onError = function (message, url, line, col) {
      storage.push(storage_id, {
        timestamp: Date.now(),
        message: message,
        url: url,
        line: line,
        col: col
      });

      sendToServer();
    };

  obj.register = function (data) {
    err_url = data.url;
    device_info = data.device_info || {};

    window.onerror = onError;
    sendToServer();
  };

  obj.setDeviceInfo = function (info) {
    device_info = info;
    sendToServer();
  };

  // For logging error explicitly
  obj.error = function (err) {
    var stack_url_data,
      length;

    if (err instanceof Error) {
      stack_url_data = err.stack.split('\n')[1];
      stack_url_data = stack_url_data.substring(stack_url_data.lastIndexOf('(')
        + 1, stack_url_data.lastIndexOf(')')).split(':');
      length = stack_url_data.length;

      onError(err.toString(), stack_url_data[length - 3],
        stack_url_data[length - 2], stack_url_data[length - 1]);
    }
  };

  return obj;
})();
