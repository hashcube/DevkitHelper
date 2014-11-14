/* global jsio, it, before, describe, assert, l18n, CACHE:true, GC.app */

jsio('import i18n as i18n');

var init = function (done) {
  'use strict';

  CACHE = {
    'resources/languages/en_US.json': JSON.stringify({
      'score': 'Score',
      'with': '$1 world'
    })
  };
  GC.app = {
    language: 'en_US'
  }
  done();
};

describe('Localization', function  () {
  'use strict';

  before(init);

  it('Should return undefined', function () {
    debugger
    assert.equal(undefined, i18n());
  });

  it('Should return score', function () {
    assert.equal('Score', i18n('score'));
  });

  it('Should return sent data', function () {
    assert.equal('hello world', i18n('with', ['hello']));
  });
});
