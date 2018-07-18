/* global device, style */

/* jshint ignore:start */
import device;
/* jshint ignore:end */

exports = (function () {
  'use strict';

  var device_width = device.screen.width,
    device_height = device.screen.height,
    base_width, base_height, scale, scale_height;

  return {

    init: function (opts) {
      var bound_width = opts.bound_width,
        bound_height = opts.bound_height,
        orientation = opts.orientation;

      if (orientation === 'portrait') {
        jsio('import resources.styles.portrait as style');
        base_width = bound_width;
        base_height = device_height * (bound_width / device_width);
        scale = device_width / bound_width;
      } else {
        jsio('import resources.styles.landscape as style');
        base_height = bound_height;
        base_width = device_width * (bound_height / device_height);
        scale = device_height / bound_height;
      }
      this.base_height = base_height;
      this.base_width = base_width;
      this.scale = scale;
      if (opts.force_tablet) {
        device.isTablet = true;
      }
      this.tablet_scale = device.isTablet ? opts.tablet :
        device.isPhablet ? opts.phablet : 1;
      this.scale_height = scale_height = base_height / bound_height;
      this.sec_scale = base_height < bound_height ? scale_height : 1;
      this.orientation = orientation;
      GC.app.view.updateOpts({
        x: 0,
        y: 0,
        width: base_width,
        height: base_height,
        scale: scale
      });
    },

    get: function (key, prop) {
      var val = style[key] || {},
        extend;

      if (val.extend) {
        extend = this.get(val.extend);
      }

      prop = prop || {};
      merge(prop, val, extend || {});
      delete prop.extend;
      return prop;
    }
  };
})();
