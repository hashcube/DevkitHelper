```javscript

Initialize tutorial in Application with data

tutorial.build({
  superview: this,
  // screen name - used to get tutorial from data
  type: "map_screen",
  // milestone number - to identify tutorial
  milestone: this._currentId,
  // timeout for tutorial to start.
  timeout: 1000,
  // disable events to this view and sub view when tutorial is visible/processing
  disable: mapView,
  // View required for the tutorial eg: Lightbox, popup, ribbon etc
  view: lightBoxView,
  // auto start tutorial
  autostart: false,
  // pass positions if you want to get position from a view.
  positions: {
    score: {
      context: user_view.highscore_bar
    },
    map: {
      context: map_icon,
      action: {
        context: map_icon
      }
    },
    gifting: {
      context: gifting_icon,
      action: {
        context: gifting_icon
      }
    },
    milestone: {
      // function to be called to get position
      function: "getNodePosition",
      // context for the function
      context: this._adventureMap[this.mapType],
      // parameters for the function
      parameters: [this._currentId],
      // action on tutorial click
      action: {
        function: "onClickTag",
        context: this,
        // parameters to be passed on tutorial click
        parameters: ["Player", {id: this._currentId}]
      }
    }
  },
});

```
