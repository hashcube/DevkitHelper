/* global jsio, assert, describe, beforeEach, it,
 Model, ModelPool
*/

jsio('import DevkitHelper.model as Model');
jsio('import DevkitHelper.modelpool as ModelPool');

var pool,
  setup = function () {
    'use strict';

    pool = new ModelPool({
      ctor: Model,
      initCount: 2
    });
  };

describe('ModelPool:', function () {
  'use strict';

  beforeEach(setup);

  describe('init()', function () {
    it('make sure model pool initiated properly', function () {
      assert.equal(2, pool._models.length);
    });
  });

  describe('_createNewModel()', function () {
    it('make createNewModel is creating new instance', function () {
      var context = {
        _models: [],
        _ctor: Model,
        _obtained: {}
      };

      pool._createNewModel.call(context);
      assert.equal(true, context._models[0] instanceof Model);
    });
  });

  describe('obtainModel()', function () {
    it('make sure model is returned', function () {
      assert.equal(true, pool.obtainModel() instanceof Model);
      assert.equal(1, pool._models.length);
    });
    it('make sure obtainedFromPool private property is set', function () {
      assert.equal(true, pool.obtainModel()._obtainedFromPool);
    });
    it('make sure pool index is incrementing', function () {
      pool.obtainModel();
      assert.equal(1, pool._models.length);
      pool.obtainModel();
      assert.equal(0, pool._models.length);
    });
    it('make sure new model is created on extra request', function () {
      pool.obtainModel();
      pool.obtainModel();
      assert.equal(true, pool.obtainModel() instanceof Model);
      assert.equal(0, pool._models.length);
    });
  });

  describe('releaseModel()', function () {
    it('make sure model is released', function () {
      var model = pool.obtainModel();

      assert.equal(true, pool.releaseModel(model));
    });
    it('make sure non-pooled models are not released', function () {
      var model = new Model();

      assert.equal(false, pool.releaseModel(model));
    });
    it('make sure pool index is re-adjusted', function () {
      var model1 = pool.obtainModel(),
       model2 = pool.obtainModel();

      pool.releaseModel(model1);
      assert.equal(1, pool._models.length);
      pool.releaseModel(model2);
      assert.equal(2, pool._models.length);
    });
  });

  describe('releaseAllModels()', function () {
    it('make sure model is released', function () {
      pool.obtainModel();
      pool.releaseAllModels();
      assert.equal(2, pool._models.length);
    });
  });
});
