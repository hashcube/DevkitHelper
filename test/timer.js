/* global jsio, it, before, describe, assert, CACHE:true, timer */

jsio('import DevkitHelper.timer as timer');
jsio('import util.underscore as _');

describe('Timer', function () {
  var start = function () {
    timer.start();
  }, clear = function () {
    timer.clear();
  };

  describe('start()', function () {
    afterEach(function () {
      timer.clear();
    });

    it('should start the timer with 100ms as default count', function (done) {
      var ticked;

      timer.on('tick', function () {
        ticked = true;
      });
      timer.start();
      setTimeout(function () {
        if (!ticked){
          done('failed to initiate tick in 100ms');
        } else {
          done();
        }
      }, 102);
    });

    it('should start the timer with 100ms as default count', function (done) {
      var ticked;

      timer.on('tick', function () {
        ticked = true;
      });
      timer.start(200);
      setTimeout(function () {
        if (!ticked){
          done('failed to initiate tick in 100ms');
        } else {
          done();
        }
      }, 202);
    });
  });

  describe('clear()', function () {
    before(start);

    it('should start clear timer', function () {
      timer.register('test', function () {});
      assert.equal(timer.has('test'), true);
      timer.clear();
      assert.equal(timer.has('test'), false);
    });
  });

  describe('unregister()', function () {
    before(start);
    after(clear)
    it('should unregister a clear a listener', function () {
      timer.register('test', function () {});
      timer.unregister('test');
      assert.equal(false, timer.has('test'));
    });
  });

  describe('register()', function () {
    before(start);
    after(clear);
    it('should unregister a clear a listener', function () {
      timer.register('test', function () {});
      assert.equal(true, timer.has('test'));
    });
  });

  describe('getListener()', function () {
    before(start);
    after(clear);
    it('should get listener', function (done) {
      timer.register('test', done);
      timer.getListener('test').callback();
    });
  });

  describe('has', function () {
    before(start);
    after(clear);
    it('should check if a listener is present', function () {
      timer.register('test', function() {});
      assert.equal(true, timer.has('test'));
      timer.unregister('test');
      assert.equal(false, timer.has('test'));
    });
  });

  describe('callListener()', function () {
    before(start);
    after(clear);
    it('should call on a function on 100ms second', function (done) {
      var ct = 0;

      timer.register('test', function () {
        ct++;
      }, 1);
      setTimeout(function () {
        done(ct === 2 ? undefined: 'time call test failed');
      }, 205);
    });
  });
});
