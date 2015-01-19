/* Module for Game Closure Devkit to handle tutorials
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

exports = {
  // screen
  screen_1: {
    // milestone number
    1: [
      {
        id: 'milestone',
        text: 'Welcome! Tap on Milestone-1 to start playing.',
      },
      {
        id: 'milestone_2',
        text: 'Second text.'
      }
    ],
    55: [
      {
        id: 'map',
        // show ok button
        ok: true,
        text: 'To go to previous map, tap here.'
      }
    ]
  },

  puzzle_screen: {
    1: [
      {
        id: 'cell',
        x: -15,
        y: -40,
        // hide next button
        hideNext: true,
        text: 'text'
      },
      {
        id: 'key',
        x: -10,
        y: -5,
        text: 'text',
        hideNext: true
      },
      {
        id: 'cell_next',
        x: -15,
        y: -40,
        text: 'text',
        hideNext: true
      },
    ],
    15: [
      {
        id: 'time',
        ok: true,
        x: -15,
        text: 'text',
        y: -40
      }
    ],

    // powerups
    colorcode: {
      id: 'colorcode',
      text: 'text',
      ok: true
    },

    autopencil: {
      id: 'autopencil',
      text: 'text',
      ok: true
    }
  },

  // these tutorials that are going to be called manually.
  // and not associated with any milestone.
  undo: [
    {
      id: 'undo',
      ms: false,
      text: 'text',
      ok: true
    }
  ],
  hint: [
    {
      id: 'hint',
      ok: true,
      text: 'text',
      ms: false
    }
  ],
};
