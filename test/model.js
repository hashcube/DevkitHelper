/* global
 localStorage:true, setTimeout,
 jsio, assert, describe,
 beforeEach, afterEach, it,
 Model, Callback
*/

jsio('import DevkitHelper.model as Model');
jsio('import event.Callback as Callback');

//global variable;
localStorage = (function () {
  'use strict';
  var ls = {}, obj = {};

  obj.setItem = function (key, data) {
    ls[key] = data;
  };
  obj.getItem = function (key) {
    return ls[key];
  };
  return obj;
})();

var model = new Model(),
  setup = function () {
    'use strict';
    model = new Model();
  },
  destroy = function () {
    'use strict';
    model.destroy();
  };

describe('Model:', function () {
  'use strict';

  beforeEach(setup);

  afterEach(destroy);

  describe('set() and get()', function () {
    it('make sure value is set to the model', function () {
      model.set('key', 2);
      assert.equal(2, model.get('key'));
      model.set({one: 1, two: 2});
      assert.equal(1, model.get('one'));
      assert.equal(2, model.get('two'));
      assert.equal({key: 2, one: 1, two: 2}.toString(), model.get().toString());
    });
  });

  describe('unset()', function () {
    it('make sure value is removed on unset call', function () {
      model.set('key', 2);
      model.unset('key');
      assert.equal(undefined, model.get('key'));
    });
    it('check bug where value was not set if tobe == prev', function () {
      model.set('key', 2);
      model.set('key', 3);
      model.set('key', 2);
      assert.equal(2, model.get('key'));
      assert.equal(3, model.getPrevious('key'));
    });
    it('check if silent is working fine', function (done) {
      model.set('key', 2);
      model.on('change:key', function () {
        assert.equal(2, model.get('key'));
        assert.equal(3, model.getPrevious('key'));
        done();
      });
      model.set('key', 3, true);
      model.set('key', 2);
    });

    it('should emit signal if not silent', function (done) {
      model.on('change:key', function () {
        done();
      });
      model.unset('key', false);
    });

    it('should not emit signal if silent', function () {
      var flag = 1;

      model.on('change:key', function () {
        flag = 0;
      });
      model.unset('key', true);
      assert.equal(undefined, model.get('key'));
      assert.equal(1, flag);
    });
  });

  describe('getPrevious()', function () {
    it('make sure previous value is saved', function () {
      model.set('key', 2);
      model.set('key', 3);
      assert.equal(2, model.getPrevious('key'));
    });
  });

  describe('events', function () {
    it('make sure event listner is called', function (done) {
      var flag = false;
      setTimeout(function () {
        var err;
        if (!flag) {
          err = 'event not triggered';
        }
        done(err);
      }, 10);

      model.on('change:key', function () {
        flag = true;
      });

      model.set('key', 2);
    });

    it('make sure event listner is removed', function (done) {
      var flag = false;
      setTimeout(function () {
        var err;
        if (flag) {
          err = 'event got triggered';
        }
        done(err);
      }, 10);

      model.on('change:key', function () {
        flag = true;
      });
      model.destroy();
      model.set('key', 2);
    });
  });

  describe('increment() and decrement()', function () {
    it('make sure attribute is incremented', function () {
      model.set('key', 1);
      assert.equal(2, model.increment('key'));
      assert.equal(2, model.get('key'));
      assert.equal(5, model.increment('key', 3));
    });
    it('make sure attribute is decremented', function () {
      model.set('key', 1);
      assert.equal(0, model.decrement('key'));
      assert.equal(0, model.get('key'));
      assert.equal(-2, model.decrement('key', 2));
    });
  });

  describe('push()', function () {
    it('make sure push will data to the end of array', function () {
      model.set('key', [1]);
      model.push('key', 2);
      assert.equal(2, model.get('key')[1]);
    });
  });

  describe('pop()', function () {
    it('should remove and return last element from the array', function () {
      model.set('key', [1, 2, 3]);
      assert.equal(3, model.pop('key'));
      assert.notEqual(3, model.get('key')[2]);
    });
  });

  describe('shift()', function () {
    it('should remove and return first element from the array', function () {
      model.set('key', [1, 2, 3]);
      assert.equal(1, model.shift('key'));
      assert.notEqual(1, model.get('key')[0]);
    });
  });

  describe('save() and load()', function () {
    var data = {id: 1, key: 'test'};
    it('make sure data is saved to localStorage', function () {
      model.set(data);
      model.save();
      assert.equal(JSON.stringify(data), localStorage.getItem(data.id));
    });
    it('make sure data is loading from localStorage', function () {
      model.load(data.id);
      assert.equal(data.toString(), model.get().toString());
    });
  });

  describe('has()', function () {
    it('make sure has function is working', function () {
      model.set('key', 1);
      assert.equal(true, model.has('key'));
      model.unset('key');
      assert.equal(false, model.has('key'));
    });
  });

  describe('chain()', function () {
    it('should call the subscriber', function (done) {
      model.chain('event-name', done);
      model.emit('event-name');
    });

    it('should work for multiple emits', function (done) {
      var count = 0,
        cb = new Callback(),
        fns = [cb.chain(), cb.chain()];

      cb.run(function () {
        done(count === 2 ? undefined : 'error');
      });

      model.chain('event-name', function (val, cb) {
        fns[count++]();
        cb();
      });
      model.emit('event-name');
      model.emit('event-name');
    });

    it('should call all the subscribers', function (done) {
      var cb = new Callback(),
        first, second;

      cb.run(function () {
        done();
      });

      first = cb.chain();
      second = cb.chain();
      model.chain('event-name', function (val, cb) {
        first();
        cb();
      });
      model.chain('event-name', function (val, cb) {
        second();
        cb();
      });

      model.emit('event-name');
    });

    it('should not call second untill first one calls cb', function (done) {
      var flag = true;

      model.chain('event-name', function () {
        setTimeout(function () {
          done(flag ? undefined : 'error');
        }, 30);
      });

      model.chain('event-name', function () {
        flag = false;
        done('error');
      });

      model.emit('event-name');
    });

    it('should not call second if cb is called with true', function (done) {
      var flag = true;

      model.chain('event-name', function (val, cb) {
        setTimeout(function () {
          done(flag ? undefined : 'error');
        }, 30);
        cb(true);
      });

      model.chain('event-name', function () {
        flag = false;
        done('error');
      });

      model.emit('event-name');
    });

    it('should queue multiple events', function (done) {
      var a = 0,
        cb = new Callback(),
        first, second;

      cb.run(function () {
        done();
      });

      first = cb.chain();
      second = cb.chain();

      model.chain('event-1', function (val, cb) {
        if (a !== 0) {
          done('error');
        } else {
          a = 1;
          first();
        }
        cb();
      });

      model.chain('event-2', function (val, cb) {
        if (a !== 1) {
          done('error');
        } else {
          a = 2;
          second();
        }
        cb();
      });

      model.emit('event-1');
      model.emit('event-2');
    });

    it('should not call second event untill first event queue is complete',
      function (done) {
      var flag = true;

      model.chain('event-1', function () {
        setTimeout(function () {
          done(flag ? undefined : 'error');
        }, 30);
      });

      model.chain('event-2', function () {
        flag = false;
        done('error');
      });

      model.emit('event-1');
      model.emit('event-2');
    });

    it('callback queue should be intact', function (done) {
      var cb = new Callback(),
        first, second;

      cb.run(function () {
        assert.strictEqual(1, model._callbacks['event-1'].length);
        assert.strictEqual(1, model._callbacks['event-2'].length);
        done();
      });

      first = cb.chain();
      second = cb.chain();

      model.chain('event-1', function (val, cb) {
        setTimeout(function () {
          cb();
          first();
        }, 100);
      });

      model.chain('event-2', function (val, cb) {
        cb();
        second();
      });

      model.emit('event-1');
      model.emit('event-2');
    });
  });

  describe('clone()', function () {
    it('make sure clone is working', function () {
      var date = new Date(),
        array = [1, 2, 3],
        object = {
          foo: {
            bar: 1
          },
          bar: 2
        },
        number = 1,
        nul = null,
        undef = undefined, // jshint ignore:line
        clone;

      // Number
      clone = model.clone(1);
      assert.equal(number, clone);
      number = 2;
      assert.notEqual(number, clone);

      // Null
      clone = model.clone(nul);
      assert.equal(nul, clone);
      nul = 2;
      assert.notEqual(nul, clone);

      // Undefined
      clone = model.clone(undef);
      assert.equal(undef, clone);
      undef = 2;
      assert.notEqual(undef, clone);

      // Date
      clone = model.clone(date);
      assert.equal(date.toString(), clone.toString());
      clone.setYear(2000);
      assert.notEqual(date.toString(), clone.toString());

      // Array
      clone = model.clone(array);
      assert.equal(array.toString(), clone.toString());
      clone[0] = 5;
      assert.notEqual(array.toString(), clone.toString());

      // Object
      clone = model.clone(object);
      assert.equal(JSON.stringify(object), JSON.stringify(clone));
      //change on cloned object should not reflect on the model
      clone.foo.bar = 3;
      assert.notEqual(JSON.stringify(object), JSON.stringify(clone));
    });
  });
});
