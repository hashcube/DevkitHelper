/* global navigator, storage, ajax */

/* jshint ignore: start */
import .storage as storage;
import util.ajax as ajax;
/* jshint ignore: end */

exports = (function () {
  'use strict';

  var err_url, uid,
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
          user: uid,
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
    uid = data.uid || 'unknown';

    window.onerror = onError;
  };

  obj.setDeviceInfo = function (info) {
    device_info = info;
  };

  obj.setUID = function (usr_id) {
    uid = usr_id;
  };

  // For logging error explicitly
  obj.error = function (err) {
    var data, length;

    if (err instanceof Error) {
      data = err.stack.split('\n')[1];
      data = data.substring(data.lastIndexOf('(') + 1,
        data.lastIndexOf(')')).split(':');
      length = data.length;

      onError(err.toString(), data[length - 3],
        data[length - 2], data[length - 1]);
    }
  };

  return obj;
})();
