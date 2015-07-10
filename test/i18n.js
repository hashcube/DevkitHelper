/* global jsio, it, before, describe, assert, CACHE:true, GC:true, i18n */

jsio('import DevkitHelper.i18n as i18n');

var init = function () {
  'use strict';

  CACHE = {
    'resources/languages/en.json': JSON.stringify({
      score: 'Score',
      with_str: '$1 world',
      moves: 'finish level in $1 {{$1|move|moves}}.',
      cacti: 'I have {{$1| a cactus| cacti}}.',
      hair: 'I have {{$1 | a hair | 2 hairs | a lot of hair}} left on my head.',
      sheep: 'I have $1 {{$1 | sheep}}.'
    })
  };
  GC.app = {
    language: 'en'
  };
};

describe('Localization', function  () {
  'use strict';

  before(init);

  it('Should return undefined', function () {
    assert.equal(undefined, i18n());
  });

  it('Should return score', function () {
    assert.equal('Score', i18n('score'));
  });

  it('Should return sent data', function () {
    assert.equal('hello world', i18n('with_str', ['hello']));
  });
});

describe('pluralization', function () {
  'use strict';

  before(init);

  it('should return singular string for moves', function () {
    assert.strictEqual('finish level in 1 move.', i18n('moves', [1]));
  });

  it('should return plural string for moves', function () {
    assert.strictEqual('finish level in 10 moves.', i18n('moves', [10]));
  });

  it('should return singular string for cactus', function () {
    assert.strictEqual('I have a cactus.', i18n('cacti', [1]));
  });

  it('should return pluralized string for cactus', function () {
    assert.strictEqual('I have cacti.', i18n('cacti', [10]));
  });

  it('should return singular string for hair', function () {
    assert.strictEqual('I have a hair left on my head.', i18n('hair', [1]));
  });

  it('should return specific string for 2 hairs', function () {
    assert.strictEqual('I have 2 hairs left on my head.', i18n('hair', [2]));
  });

  it('should return specific string for a lot of hair', function () {
    assert.strictEqual('I have a lot of hair left on my head.',
      i18n('hair', [100000]));
  });

  it('should return singular string for 1 sheep', function () {
    assert.strictEqual('I have 1 sheep.', i18n('sheep', [1]));
  });

  it('should return plural string for 10 sheep', function () {
    assert.strictEqual('I have 10 sheep.', i18n('sheep', [10]));
  });
});
