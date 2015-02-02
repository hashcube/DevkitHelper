/* global jsio, it, before, describe, assert, timer, after, afterEach,
  beforeEach, setTimeout */

jsio('import DevkitHelper.timer as timer');
jsio('import util.underscore as _');

describe('Timer', function () {
  'use strict';

  var clear = function () {
    timer.clear();
  };
  beforeEach(clear);

  describe('clear()', function () {

    it('should cleal all timers', function () {
      timer.register('test', function () {}, 1);
      assert.equal(!!timer._listeners['test'], true);
      timer.clear();
      assert.equal(!!timer._listeners['test'], false);
    });
  });

  describe('unregister()', function () {
    it('should unregister a listener', function () {
      timer.register('test', function () {}, 1);
      timer.unregister('test');
      assert.equal(false, !!timer._listeners['test']);
    });
  });

  describe('register()', function () {
    it('should register a listener', function (done) {
      var cache = setInterval;

      setInterval = function () {
        done();
        setInterval = cache;
      }

      timer.register('test', function () {}, 1);
    });
  });

  describe('pause()', function () {
    it('should call clearInterval if a listener is active', function (done) {
      var cache = clearInterval;

      clearInterval = function () {
        done();
        clearInterval = cache;
      }
      timer.register('test', function () {}, 1);
      timer.pause('test');
    });
  });

  describe('resume()', function () {
    it('should pause if a listener is active', function (done) {
      var cache = setInterval;

      setInterval = function () {
        done();
        setInterval = cache;
      }

      timer.register('test', function () {}, 1);
      timer.pause('test');
      timer.resume('test');
    });
  });
});
