/* global jsio, loading, beforeEach, test_util, View, describe, it, assert,
  loader, history */

jsio('import test.lib.util as test_util');
jsio('import DevkitHelper.loading as loading');
jsio('import DevkitHelper.history as history');
jsio('import ui.View as View');
jsio('import ui.resource.loader as loader');

describe('Loading', function () {
  'use strict';

  var view,
    folders = {puzzle: 'image/puzzle'},
    init = function () {
      view = new View();
      view.build = function () {
      };
      loading.initialize(view, folders);
    },
    reloadLoading = function () {
      test_util.removeFromJSIOCache('loading.js');
      jsio('import DevkitHelper.loading as loading');
    };

  beforeEach(init);

  describe('initialize()', function () {

    it('should set view as the passed view', function () {
      assert.equal(view, loading._view);
    });

    it('should set folders property as given value', function () {
      assert.deepEqual(folders, loading._folders);
    });

    it('should set passed folder data to folder property', function () {
      var folder_data = {puzzle: 'images/puzzle'};

      loading.initialize(view, folder_data);
      assert.deepEqual(folder_data, loading._folders);
    });
  });

  describe('show()', function () {
    it('should call setBusy of history', function (done) {
      var parent = new View(),
        cache = history.setBusy;

      history.setBusy = function () {
        history.setBusy = cache;
        done();
      };

      loading.show(parent);
    });

    it('should make loading view visible and update superview', function () {
      var parent = new View();

      loading.show(parent);
      assert.strictEqual(true, view.style.visible);
      assert.strictEqual(parent.uid, view.__parent.uid);
    });

    it('should invoke loaders preload method with path', function (done) {
        var view = new View(),
          cache = loader.preload;

        loader.preload = function (path) {
          loader.preload = cache;
          done(path === folders.puzzle ? undefined : 'error');
        };
        loading.show(view, 'puzzle');
      }
    );

    it('should register hide ViewDidDisappear event', function (done) {
      var parent = new View(),
        cache_hide = loading.hide;

      loading.hide = function () {
        loading.hide = cache_hide;
        done();
      };

      loading.show(parent);
      parent.emit('ViewDidDisappear');
    });

    it('should invoke callback if provided', function (done) {
      var parent = new View();

      loading.show(parent, null, done);
    });

    it('should emit show', function (done) {
      var parent = new View();

      loading.once('show', done);
      loading.show(parent);
    });
  });

  describe('hide()', function () {
    it('should remove view from parent and hide it', function () {
      var parent = new View();

      loading.show(parent);
      assert.strictEqual(parent.uid, view.__parent.uid);
      assert.strictEqual(true, loading._view.style.visible);
      loading.hide();
      assert.strictEqual(null, view.__parent);
      assert.strictEqual(false, loading._view.style.visible);
    });

    it('should call history.resetBusy', function (done) {
      var cache = history.resetBusy,
        parent = new View();

      history.resetBusy = function () {
        history.resetBusy = cache;
        done();
      };

      loading.show(parent);
      loading.hide();
    });

    it('should emit hide', function (done) {
      var parent = new View();

      loading.show(parent);
      loading.on('hide', done);
      loading.hide();
    });
  });
});
