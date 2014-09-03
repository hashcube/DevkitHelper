/* global jsio, it, before, describe, assert, l18n, CACHE:true */

jsio('import src.l18n as l18n');

var init = function (done) {
  'use strict';

  CACHE = {
    'resources/languages/en_US.json': JSON.stringify({
      'score': 'Score',
      'with': '$1 world'
    })
  };
  done();
};

describe('Localization', function  () {
  'use strict';

  before(init);

  it('Should return undefined', function () {
    assert.equal(undefined, l10n());
  });

  it('Should return score', function () {
    assert.equal('Score', l10n('score'));
  });

  it('Should return sent data', function () {
    assert.equal('hello world', l10n('with', ['hello']));
  });
});
