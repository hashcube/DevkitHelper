/* global CACHE:true, device:true, style, util_test */

jsio('import test.lib.util as util_test');
jsio('import device');

var prepare = function (orientation, tablet, phablet) {
  'use strict';

  GC.app = {
    view: {
      updateOpts: function () {}
    }
  };

  device.screen.width = 500;
  device.screen.height = 1000;
  device.isTablet = tablet || false;
  device.isPhablet = phablet || false;

  util_test.removeFromJSIOCache('style.js');
  jsio('import resources.styles.portrait as portrait');
  jsio('import resources.styles.landscape as landscape');
  jsio('import src.style as style');
  util_test.getFromJSIOCache(orientation + '.js').exports = {
    key1: {
      prop: 'val'
    },
    key2: {
      extend: 'key1',
      prop2: 'val2'
    }
  };

  style.init({
    bound_width: 100,
    bound_height: 100,
    orientation: orientation,
    tablet: 0.7,
    phablet: 0.9
  });
};

describe('Style:', function  () {
  'use strict';

  describe('init()', function  () {
    it('should calculate base height and width for portrait', function () {
      prepare('portrait');
      assert.strictEqual(100, style.base_width);
      assert.strictEqual(200, style.base_height);
      assert.strictEqual(5, style.scale);
      assert.strictEqual(2, style.scale_height);
    });

    it('should calculate base height and width for landscape', function () {
      prepare('landscape');
      assert.strictEqual(50, style.base_width);
      assert.strictEqual(100, style.base_height);
      assert.strictEqual(10, style.scale);
      assert.strictEqual(1, style.scale_height);
    });

    it('should set tablet scale value for tablets', function () {
      prepare('landscape', true);
      assert.strictEqual(0.7, style.tablet_scale);
    });

    it('should set tablet scale value as 1 for mobilephones', function () {
      prepare('landscape');
      assert.strictEqual(1, style.tablet_scale);
    });

    it('should set tablet scale value as 0.9 for phablets', function () {
      prepare('landscape', false, true);
      assert.strictEqual(0.9, style.tablet_scale);
    });
  });

  describe('get()', function  () {
    it('should return style from json', function () {
      prepare('portrait');
      assert.deepEqual({prop: 'val'}, style.get('key1'));
    });

    it('should merge with passed properties', function () {
      prepare('portrait');
      assert.deepEqual({prop: 'val', prop3: 'val3'},
        style.get('key1', {prop3: 'val3'}));
    });

    it('should extend from default property', function () {
      prepare('portrait');
      assert.deepEqual({prop: 'val', prop2: 'val2'}, style.get('key2'));
    });
  });
});
