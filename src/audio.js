/* global AudioManager, _ */

/* jshint ignore:start */
import AudioManager;
import util.underscore as _;
/* jshint ignore:end */

exports = (function () {
  'use strict';

  var sounds, music, effect, sound,
    setMute = function (type, is_mute) {
      switch (type) {
        case 'music':
          sound.setMusicMuted(is_mute);
          break;
        case 'effect':
          sound.setEffectsMuted(is_mute);
          break;
      }
    },
    background_music;

  return {

    init: function (file, is_user_effect, is_user_music) {
      sounds = JSON.parse(CACHE['resources/' + file + '.json']);
      music = sounds.music;
      effect = sounds.effect;
      sound = new AudioManager({
        path: 'resources/sounds',
        files: _.extend({}, music, effect)
      });

      setMute('music', !is_user_music);
      setMute('effect', !is_user_effect);
    },

    play: function (file) {
      var music_file = music[file],
        sound_file = effect[file];

      if (music_file && music_file.background) {
        background_music = file;
      }

      if (music_file || sound_file) {
        sound.play(file);
      }
    },

    isPlaying: function (file) {
      return sound.isPlaying(file);
    },

    pause: function (file) {
      sound.pause(file);
    },

    stop: function (file) {
      sound.stop(file);
    },

    stopBackground: function () {
      if (background_music) {
        sound.stop(background_music);
        background_music = null;
      }
    },

    toggle: function (type) {
      var is_muted;

      if (type === 'music') {
        is_muted = sound.getMusicMuted();
      } else {
        is_muted = sound.getEffectsMuted();
      }
      setMute(type, !is_muted);
      return !is_muted;
    }
  };
}());

