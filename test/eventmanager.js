/* global jsio:true, it, beforeEach, describe, assert, event_manager, test_sdk
*/

var init = function () {
  'use strict';

  jsio('import DevkitHelper.event_manager as event_manager');
  jsio('import test.test_sdk as test_sdk');
};

describe('EventManager', function  () {
  'use strict';

  beforeEach(init);

  describe('prepare', function () {
    it('add ../../ to jsio path', function () {
      var cache = jsio;

      event_manager._setJSIO({
        path: {
          add: function (path) {
            assert.strictEqual(path, '../../');
          }
        }
      });
      event_manager._setJSIO(cache);
      event_manager.prepare();
    });
  });

  describe('register', function () {
    it('import all the plugins', function (done) {
      var cache = jsio;

      event_manager._setJSIO(function (plugin) {
        event_manager._setJSIO(cache);
        assert.strictEqual('import .gameanalytics as gameanalytics', plugin);
        done();
      });
      event_manager.register('', ['gameanalytics']);
    });
  });

  describe('emit', function () {
    it('call the plugin function if registered', function (done) {
      event_manager.register('test', ['test_sdk']);
      test_sdk.transactionComplete = function () { done(); };
      event_manager.emit('transaction-complete', {cost: 100});
    });
  });

  describe('toCamel()', function () {
    it('should convert - to camel case', function () {
      assert.strictEqual('functionName',
        event_manager._toCamel('function-name'));
    });
  });
});
