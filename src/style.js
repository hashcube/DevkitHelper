/* global device */

/* jshint ignore:start */
import device;

/* jshint ignore:end */

exports = (function () {
  'use strict';

  var device_width = device.screen.width,
    device_height = device.screen.height,
    base_width, base_height, scale, scale_height,
    style = {};

  return {

    init: function (properties) {
      var bound_width = properties.bound_width,
        bound_height = properties.bound_height,
        orientation = properties.orientation;

      style = JSON.parse(CACHE['resources/styles/' + properties.orientation +
        '.json']);
      if (properties.orientation === 'portrait') {
        base_width = bound_width;
        base_height = device_height * (bound_width / device_width);
        scale = device_width / bound_width;
      } else {
        base_height = bound_height;
        base_width = device_width * (bound_height / device_height);
        scale = device_height / bound_height;
      }
      this.base_height = base_height;
      this.base_width = base_width;
      this.scale = scale;
      this.tablet_scale = device.isTablet ? properties.tablet :
        (device.isPhablet ? properties.phablet : 1);
      this.scale_height = scale_height = base_height / bound_height;
      this.sec_scale = base_height < bound_height ? scale_height : 1;
      this.orientation = orientation;
      GC.app.view.style.scale = scale;
    },

    get: function (key, prop) {
      var val = style[key] || {},
        extend;

      if (val.extend) {
        extend = this.get(val.extend);
        delete val.extend;
      }
      return merge(prop || {}, val, extend || {});
    }
  };
})();
