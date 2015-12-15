/* global GCMath, logger,  _, Emitter */

/* jshint ignore:start */
import event.Emitter as Emitter;

import util.underscore as _;
import math.util as GCMath;

/* jshint ignore:end */

exports = new (Class(Emitter, function () {
  "use strict";

  var isDismissed = false,
    chosen = false,
    ad, available_networks, selected_networks, weight, size, isEligible,
    ad_details = {},

    /* private functions */
    chooseAd = function () {
      var rand = GCMath.random(1, weight + 1);

      // total weight is the weight of the last element
      // picks the cumulative weighted value based on random
      // which I call weighted probability
      ad = _.find(selected_networks, function (v, n) {
        return rand <= n ? v : false;
      });
      if (!_.isUndefined(ad_details[ad])) {
        chosen = ad_details[ad];
        chosen.cache();
        chosen = ad;

        // if callback doesn't determine ad will be available,
        // assume it will be cached
        // TODO deal with ad networks not having callbacks
        if (_.isUndefined(chosen.onAdAvailable)) {
          chosen = ad;
        }
      } else if (--size > 0) {
        // this case is mostly because the sdk hasn't been integrated,
        // so choose again
        chooseAd();
      }
    },

    registerCallbacks = function () {
        var onAdDismissed = bind(this, function () {
            if (!isDismissed) {
              this.emit("closed");
              isDismissed = true;
              }
            }),
          onAdAvailable = function (available_ad) {
            logger.log("{admanager} ad available", available_ad);
            chosen = available_ad;
          },
          onAdNotAvailable = function () {
            logger.log("{admanager} ad not available");

            // ad not available, reset
            chosen = false;
          };

      _.each(ad_details, function (ad_detail) {
        // ad dismissed(close or clicked on ad)
        ad_detail.onAdDismissed = onAdDismissed;
        // on ad available
        ad_detail.onAdAvailable = onAdAvailable;
        // on ad not available
        ad_detail.onAdNotAvailable = onAdNotAvailable;
      });
    },

    // given a obj{k: 1, k2: 2, k3: 3} returns [{1: k, 3:k2, 5:k3}, 5]
    // return is an array of the object to cumulative values and the largest
    // value

    // ones that have 0 are removed
    cumulative = function (obj) {
      var sum = 0,
        priority = {};

      _.each(obj, function (v, k) {
        if (v !== 0) {
          sum += v;
          priority[sum] = k;
        }
      });
      return [priority, sum];
    };

  this.initialize = function (ad_desc) {
    _.each(ad_desc.networks, function (ad_module) {
      ad_module.cache = ad_module.cacheInterstitial;
      ad_module.show = ad_module.showInterstitial;
    });
    ad = ad_desc.ratio;
    available_networks = cumulative(ad);
    selected_networks = available_networks[0];
    weight = available_networks[1];
    ad_details = ad_desc.networks;
    size = _.size(ad_details);
    isEligible = ad_desc.isEligible;

    // subscribe to offer close
    registerCallbacks.apply(this)
  };

  this.updateWeight = function (updated_ad) {
    ad = updated_ad;
  };

  this.cacheAd = function () {
    // is eligible for ad
    if (isEligible()) {
      chooseAd();
    }
    isDismissed = false;
  };

  this.showAd = function () {
    // assigning cached ad to chosen
    if (chosen) {
      if (!_.isUndefined(ad_details[ad])) {
        ad_details[chosen].show();
      }
      chosen = false;
      return true;
    }
    return false;
  };
}))();
