/* Module for Game Closure Devkit to handle tutorials, View part
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global ImageView, View, TextView, Image,
 ImageScaleView, ButtonView, animate */

/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;
import ui.resource.Image as Image;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;
import ui.widget.ButtonView as ButtonView;
import animate;
/* jshint ignore:end */

exports = Class(ImageView, function (supr) {
  'use strict';

  // size of middle part in the 9 slice image
  var middle = 250,
    baseHeight = 1024,
    baseWidth = 768,
    scale = 1;

  this.init = function() {
    var bg = new Image({url: 'tutorial/msg.png'}),
      img_button = new Image({url: 'tutorial/button.png'}),
      opts = {
        layout: 'box',
        image: bg,
        width: bg.getWidth(),
        height: bg.getHeight(),
        centerX: true,
        zIndex: 1
      },

      getSize = function(max) {
        return max - middle / 2;
      },
      overlay;

    supr(this, 'init', [opts]);

    overlay = this.overlay = new ImageScaleView({
      image: 'tutorial/overlay.png',
      scaleMethod: '9slice',
      anchorX: baseWidth,
      anchorY: baseHeight,
      scale: 0.1,
      width: baseWidth*2,
      height: baseHeight*2,
      sourceSlices: {
        horizontal: {
          left: 50,
          center: middle,
          right: 50
        },
        vertical: {
          top: 50,
          middle: middle,
          bottom: 50
        }
      },
      destSlices: {
        horizontal: {
          left: getSize(baseWidth),
          center: middle,
          right: getSize(baseWidth)
        },
        vertical: {
          top: getSize(baseHeight),
          middle: middle,
          bottom: getSize(baseHeight)
        }
      },
    });

    this.clickHandler = new View({
      superview: overlay,
      layout: 'box',
      centerX: true,
      centerY: true,
      width: middle,
      height: middle
    });

    this.text = new TextView({
      superview: this,
      layout: 'box',
      centerX: true,
      layoutWidth: '90%',
      height: 85,
      top: 15,
      size: 25,
      wrap: true,
      autoFontSize: true,
      color: '#AF2F19'
    });

    this.button = new ButtonView({
      superview: this,
      layout: 'box',
      height: img_button.getHeight(),
      width: img_button.getWidth(),
      bottom: 10,
      right: 10,
      order: 2,
      images: {
        up: img_button
      },
      text: {
        color: '#AF2F19',
        size: 25
      },
      on: {
        up: bind(this, function() {
          this.clean();
          this.emit('next');
        })
      }
    });
  };

  this.clean = function() {
    this.removeFromSuperview();
    this.clickHandler.removeAllListeners('InputSelect');
  };

  this.finish = function(view, cb) {
    var overlay = this.overlay;

    animate(overlay).
      then({scale: 1.5, opacity: 0.1}, 500).
      then(function() {
        overlay.removeFromSuperview();
        view && view.setHandleEvents(true, false);
        cb && cb();
      }, 0);
  };

  this.show = function(opts) {
      /*

      |<-----baseWidth*2--->|
      ................................. ---
      .        .            .         .  |
      .        .            .         .  |
      .        .            .         .  |
      ........(X)------------..........  |
      .        |            |         .  |
      .        |            |         .  baseHeight*2
      .        |  visible   |         .  |
      .        |    area    |         .  |
      .        |            |         .  |
      .........--------------.......... ---
      .        .            .         .
      .        .            .         .
      .................................

      (X) -> position of the middle section in ImageScaleView,
        when (x, y) position of the overlay is (-baseWidth, -baseHeight)
        (X) will be in the top left of visible region.
      */
    var overlay = this.overlay,
      clickHandler = this.clickHandler,
      height = this. _opts.height,
      button = this.button,
      getPos = function(base, pos) {
        return -base + pos/scale + middle/4;
      };

    this.clean();

    overlay.updateOpts({
      superview: opts.superview,
      x: getPos(baseWidth, opts.x),
      y: getPos(baseHeight, opts.y)
    });

    if(opts.action) {
      clickHandler.on('InputSelect', bind(this, function() {
        this.clean();
        var action = opts.action,
          func = action.func || 'onInputSelect',
          parameters = action.parameters || [];
        action.context[func].apply(action.context, parameters);
        this.emit('next');
      }));
      clickHandler.show();
      clickHandler.setHandleEvents(false);
    } else {
      clickHandler.hide();
    }

    button.setTitle('tutorial-' + (opts.next ? 'next' : 'ok'));
    button.style.visible = opts.next || opts.ok;

    this.text.setText(opts.text);

    animate(overlay).
      now({scale: 0.1, opacity: 0}, 0).
      then({scale: 1, opacity: 1}, 500).
      then(bind(this, function() {
        var y = opts.y/scale;

        y += y+height+middle > baseHeight ? -middle : middle;
        this.updateOpts({
          superview: opts.superview,
          visible: true,
          y: y
        });
        clickHandler.setHandleEvents(true);
      }, 0));
  };
});
