/* global localStorage, _ */

/* jshint ignore: start */
import util.underscore as _;
/* jshint ignore: end */

exports = {
  // retrieve data from storage
  get: function (key) {
    'use strict';

    var val = localStorage.getItem(key);

    try {
      val = JSON.parse(val);
    } catch (e) {
    }

    return val;
  },

  // save data to storage
  set: function (key, val) {
    'use strict';

    if (_.isObject(val)) {
      val = JSON.stringify(val);
    }

    localStorage.setItem(key, val);
  },

  // push value to an array saved in the storage
  push: function (key, val) {
    'use strict';

    var data = this.get(key);

    if (_.isEmpty(data)) {
      data = [];
    }
    data.push(val);

    this.set(key, data);
  },

  // add value to an object saved in the storage
  add: function (key, id, val) {
    'use strict';

    var data = this.get(key);

    if (_.isEmpty(data)) {
      data = {};
    }

    data[key](val);

    this.set(key, data);
  },

  // delete data from the storage
  del: function (id) {
    'use strict';

    localStorage.removeItem(id);
  },

  // clean all data from the storage
  clear: function () {
    'use strict';

    localStorage.clear();
  }
};
