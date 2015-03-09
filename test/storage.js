/* global localStorage:true, jsio, assert, describe,
 beforeEach, it, storage */

jsio('import src.storage as storage');

describe('Model:', function () {
  'use strict';

  var data;

  beforeEach(function () {
    // mock local storage
    localStorage = {
      setItem: function (key, val) {
        data[key] = val;
      },
      getItem: function (key) {
        return data[key];
      },
      removeItem: function (key) {
        delete data[key];
      },
      clear: function () {
        data = {};
      }
    };

    localStorage.clear();
  });

  describe('set()', function () {
    it('should set value to localstorage', function () {
      localStorage.setItem = function (key, val) {
        assert.strictEqual('key', key);
        assert.strictEqual('val', val);
      };

      storage.set('key', 'val');
    });

    it('should convert it to string if value is an object', function () {
      localStorage.setItem = function (key, val) {
        assert.strictEqual('key', key);
        assert.strictEqual('{"a":1}', val);
      };

      storage.set('key', {a: 1});
    });
  });

  describe('get()', function () {
    it('should get value from localstorage', function () {
      localStorage.getItem = function () {
        return 'val';
      };

      assert.strictEqual('val', storage.get('key'));
    });

    it('should convert it to object if it is parsable', function () {
      localStorage.getItem = function () {
        return '{"a":1}';
      };

      assert.deepEqual({a: 1}, storage.get('key'));
    });

    it('should return null if data is not found', function () {
      localStorage.getItem = function () {
        return null;
      };

      assert.deepEqual(null, storage.get('key'));
    });
  });

  describe('isSet()', function () {
    it('should return true if data is found', function () {
      localStorage.getItem = function () {
        return 'val';
      };

      assert.strictEqual(true, storage.isSet('key'));
    });

    it('should return false if data is not found', function () {
      localStorage.getItem = function () {
        return null;
      };

      assert.deepEqual(false, storage.isSet('key'));
    });
  });

  describe('push()', function () {
    it('should push data to an existing array', function () {
      storage.set('key', [1, 2]);
      assert.deepEqual([1, 2], storage.get('key'));

      storage.push('key', 3);
      assert.deepEqual([1, 2, 3], storage.get('key'));
    });

    it('should create an array and push data', function () {
      storage.push('key', 3);
      assert.deepEqual([3], storage.get('key'));
    });
  });

  describe('add()', function () {
    it('should add data to an existing object', function () {
      storage.set('key', {a: 1});
      assert.deepEqual({a: 1}, storage.get('key'));

      storage.add('key', 'b', 2);
      assert.deepEqual({a: 1, b: 2}, storage.get('key'));
    });

    it('should create an object and add data', function () {
      storage.add('key', 'b', 2);
      assert.deepEqual({b: 2}, storage.get('key'));
    });
  });

  describe('del()', function () {
    it('should delete data from local storage', function () {
      storage.set('key', {a: 1});
      storage.del('key');

      assert.deepEqual(false, storage.isSet('key'));
    });
  });

  describe('clear()', function () {
    it('should delete data from local storage', function () {
      storage.set('key', {a: 1});
      storage.clear();

      assert.deepEqual(false, storage.isSet('key'));
    });
  });
});
