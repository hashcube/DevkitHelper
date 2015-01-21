/* global Class, _, logger */

/* jshint ignore:start */
import util.underscore as _;
/* jshint ignore:end */

exports = Class(function () {
  'use strict';

  this.init = function (opts) {
    var i = opts.initCount || 0;

    this._models = [];
    this._obtained = {};
    this._ctor = opts.ctor;

    _.times(i, this._createNewModel, this);
  };

  this._createNewModel = function () {
    var models = this._models,
      model = new this._ctor();

    model._index = models.length + _.size(this._obtained);
    models.push(model);
  };

  /* Returns a model from the pool */
  this.obtainModel = function () {
    var model = this._models.pop();

    if (!model) {
      logger.log('MAKING NEW MODEL FOR: ' + this._ctor);
      this._createNewModel();
      model = this._models.pop();
    }
    model._obtainedFromPool = true;
    this._obtained[model._index] = model;
    if (model.onObtain) {
      model.onObtain();
    }
    return model;
  };

  /* Release a model to recycle */
  this.releaseModel = function (model) {
    // Only allow a model to be released once per obtain
    if (model._obtainedFromPool) {
      if (model.onRelease) {
        model.onRelease();
      }
      model._obtainedFromPool = false;
      delete this._obtained[model._index];
      this._models.push(model);
      return true;
    }
    return false;
  };

  /* Release all models */
  this.releaseAllModels = function () {
    _.each(this._obtained, bind(this, function (model) {
      this.releaseModel(model);
    }));
  };
});
