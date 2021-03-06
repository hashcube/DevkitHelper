/* Storage module to handle HTML5 localStorage operations
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
*/

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

    // avoid setting null/undefined
    if (!val) {
      this.del(key);
      return;
    }

    if (_.isObject(val)) {
      val = JSON.stringify(val);
    }

    localStorage.setItem(key, val);
  },

  isSet: function (key) {
    'use strict';

    return !_.isEmpty(this.get(key));
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
    data[id] = val;

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
