/* global localStorage, _ */

/* jshint ignore: start */
import util.underscore as _;
/* jshint ignore: end */

exports = {
  get: function (key, obj) {
    'use strict';

    var val = localStorage.getItem(key);

    if (obj !== false) {
      val = JSON.parse(val || '{}');
    }

    return val;
  },

  set: function (key, val) {
    'use strict';

    if (_.isObject(val)) {
      val = JSON.stringify(val);
    }

    localStorage.setItem(key, val);
  },

  push: function (key, val) {
    'use strict';

    var data = this.get(key);

    if (_.isEmpty(data)) {
      data = [];
    }
    data.push(val);

    this.set(key, data);
  },

  add: function (key, id, val) {
    'use strict';

    var data = this.get(key);

    data[key](val);

    this.set(key, data);
  }
};
