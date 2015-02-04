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
      timer.register('test1', function () {}, 1);
      timer.register('test2', function () {}, 1);
      assert.strictEqual(3, _.keys(timer._listeners).length);
      timer.clear();
      assert.strictEqual(0, _.keys(timer._listeners).length);
    });
  });

  describe('unregister()', function () {
    it('should unregister a listener', function () {
      var counter = 0,
        timers = ['test', 'test1', 'test2'];

      _.each(timers, function (test) {
        timer.register(test, function () {}, 1);
      });
      timer.unregister(timers);
      assert.equal(false, !!timer._listeners['test']);
      assert.equal(false, !!timer._listeners['test1']);
      assert.equal(false, !!timer._listeners['test2']);
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
      var cache = clearInterval,
        counter = 0,
        timers = ['test', 'test1', 'test2'];

      _.each(timers, function (test) {
        timer.register(test, function () {}, 1);
      });
      clearInterval = function () {
        if (++counter === 3) {
          done();
          clearInterval = cache;
        }
      }
      timer.pause(timers);
    });
  });

  describe('resume()', function () {
    it('should pause if a listener is active', function (done) {
      var cache = setInterval,
        counter = 0,
        timers = ['test', 'test1', 'test2'];

      _.each(timers, function (test) {
        timer.register(test, function () {}, 1);
      });
      setInterval = function () {
        if (++counter === 3) {
          done();
          setInterval = cache;
        }
      }

      timer.pause(timers);
      timer.resume(timers);
    });
  });
});
