/* global GCMath, logger,  _, Emitter */

/* jshint ignore:start */
import event.Emitter as Emitter;

import util.underscore as _;
import math.util as GCMath;

/* jshint ignore:end */

exports = new (Class(Emitter, function () {
  "use strict";

  var is_dismissed = false,
    chosen = false,
    ad, available_networks, selected_networks, weight, size,
    isEligibleForInterstitial, isEligibleForVideo,
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
        ad_details[ad].obj.cache();

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
          if (!is_dismissed) {
            this.emit("closed");
            is_dismissed = true;
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
        if (ad_detail.type === 'interstitial') {
          // ad dismissed(close or clicked on ad)
          ad_detail.obj.onAdDismissed = onAdDismissed;

          // on ad available
          ad_detail.obj.onAdAvailable = onAdAvailable;

          // on ad not available
          ad_detail.obj.onAdNotAvailable = onAdNotAvailable;
        }
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

  this.initialize = function (ad_desc, user_id) {
    _.each(ad_desc.networks, function (ad_module) {
      switch (ad_module.type) {
        case "interstitial":
          ad_module.obj.cache = ad_module.obj.cacheInterstitial;
          ad_module.obj.show = ad_module.obj.showInterstitial;
          break;
        case "video":
          ad_module.obj.initVideoAd(user_id);
          ad_module.obj.onVideoClosed = ad_module.cb;
          break;
      }
    });
    ad = ad_desc.ratio;
    available_networks = cumulative(ad);
    selected_networks = available_networks[0];
    weight = available_networks[1];
    ad_details = ad_desc.networks;
    size = _.size(ad_details);
    isEligibleForInterstitial = ad_desc.isEligibleForInterstitial;
    isEligibleForVideo = ad_desc.isEligibleForVideo;

    // subscribe to offer close
    registerCallbacks.apply(this);
  };

  this.updateWeight = function (updated_ad) {
    ad = updated_ad;
  };

  this.cacheAd = function () {
    // is eligible for ad
    if (isEligibleForInterstitial()) {
      chooseAd();
    }
    is_dismissed = false;
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

  this.showVideoAd = function(source) {
    var flag;

    flag = _.find(ad_details, function (ad_module) {
      if (ad_module.type === "video" && ad_module.obj.isVideoAdAvailable()) {
        ad_module.obj.showVideoAd(source);
        return true;
      }
    });
    return flag;
  };

  this.isVideoAdAvailable = function() {
    var flag;

    flag = _.find(ad_details, function (ad_module) {
      if (ad_module.type === "video" && ad_module.obj.isVideoAdAvailable() && isEligibleForVideo()) {
        return true;
      }
    });
    return flag ? true : false;
  };
}))();
