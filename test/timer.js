/* global jsio, it, before, describe, assert, timer, after, afterEach,
  beforeEach, setTimeout */

jsio('import DevkitHelper.timer as timer');
jsio('import util.underscore as _');

describe('Timer', function () {
  'use strict';

  var start = function () {
    timer.start();
  },
  clear = function () {
    timer.clear();
  };

  describe('start()', function () {
    afterEach(function () {
      timer.clear();
    });

    it('should start the timer with 100ms as default count', function (done) {
      var ticked;

      timer.start();
      timer.register(this, 'tick', function () {
        ticked = true;
      }, 100);
      setTimeout(function () {
        done(ticked ? undefined: 'error');
      }, 102);
    });

    it('should start the timer with 200ms as default count', function (done) {
      var ticked;

      timer.start(2);
      timer.register(this, 'tick', function () {
        ticked = true;
      }, 1);
      setTimeout(function () {
        if (!ticked){
          done('failed to initiate tick in 105ms');
        } else {
          done();
        }
      }, 205);
    });

    it('should make sure callback back is not called before 100ms',
      function (done) {
        var ticked;

        timer.start(100);
        timer.register(this, 'tick', function () {
          ticked = 'error: called before 100ms';
        }, 1);
        setTimeout(function () {
          done(ticked);
        }, 99);
      });
  });

  describe('clear()', function () {
    before(start);

    it('should start clear timer', function () {
      timer.register(this ,'test', function () {});
      assert.equal(timer.has('test'), true);
      timer.clear();
      assert.equal(timer.has('test'), false);
    });
  });

  describe('unregister()', function () {
    before(start);
    after(clear);
    it('should unregister a listener', function () {
      timer.register(this, 'test', function () {});
      timer.unregister('test');
      assert.equal(false, timer.has('test'));
    });
  });

  describe('register()', function () {
    before(start);
    after(clear);
    it('should unregister a clear a listener', function () {
      timer.register(this, 'test', function () {});
      assert.equal(true, timer.has('test'));
    });
  });

  describe('getListener()', function () {
    before(start);
    after(clear);
    it('should get listener', function (done) {
      timer.register(this, 'test', done);
      timer.getListener('test').callback();
    });
  });

  describe('has', function () {
    before(start);
    after(clear);
    it('should check if a listener is present', function () {
      timer.register(this, 'test', function() {});
      assert.equal(true, timer.has('test'));
      timer.unregister('test');
      assert.equal(false, timer.has('test'));
    });
  });

  describe('callListener()', function () {
    before(start);
    after(clear);
    it('should call on a function on 300ms second', function (done) {
      var ct = 0;

      timer.register(this, 'test', function () {
        ct++;
      }, 100);
      setTimeout(function () {
        done(ct >= 1 ? undefined: 'time call test failed');
      }, 102);
    });
  });

  describe('once', function () {
    beforeEach(start);
    afterEach(clear);
    it('should execute only once', function (done) {
      var ct = 0;

      timer.once(this, 'test', function () {
        ct++;
      }, 1);
      setTimeout(function () {
        done((ct > 1) ? 'error': undefined);
      }, 20);
    });
  });

  describe('pause()', function () {
    beforeEach(start);
    afterEach(clear);
    it('should not execute a registered listener when timer is paused',
      function (done) {
        var exec;

        timer.register(this, 'test', function () {
          exec = 'error: test executed';
        }, 1);
        timer.pause();
        setTimeout(function () {
          done(exec);
        }, 20);
      });

    it('should execute function after start is called', function (done) {
      var exec = 'error not executed';

      timer.register(this, 'test', function () {
        exec = undefined;
      }, 100);
      timer.pause();
      timer.start();
      setTimeout(function() {
        done(exec);
      }, 200);
    });
  });
});
