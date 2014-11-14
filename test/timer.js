/* global jsio, it, before, describe, assert, CACHE:true, timer */

jsio('import DevkitHelper.timer as timer');

describe('Timer', function () {
  describe('start()', function () {
    debugger;
    afterEach(function() {
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
});
