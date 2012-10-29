
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var RedisStore, appInfoParse, appPath, config, cookieParser, defaultOptions, express, redisClient, redisOptions, session, sessionHandleFunctions, _;

  config = require('../config');

  appPath = config.getAppPath();

  express = require('express');

  _ = require('underscore');

  RedisStore = require('connect-redis')(express);

  redisClient = require("" + appPath + "/models/redisclient");

  appInfoParse = require("" + appPath + "/helpers/appinfoparse");

  defaultOptions = {
    key: 'vicanso',
    secret: 'jenny&tree'
  };

  redisOptions = {
    client: redisClient,
    ttl: 30 * 60
  };

  sessionHandleFunctions = {};

  cookieParser = express.cookieParser();

  session = {
    /**
     * [handler session的处理函数]
     * @return {[type]} [description]
    */

    handler: function() {
      return function(req, res, next) {
        return cookieParser(req, res, function() {
          var appName;
          appName = appInfoParse.getAppName(req);
          return session.getHandler(appName)(req, res, next);
        });
      };
    },
    /**
     * [addHandler 添加session的处理函数]
     * @param {[type]} appName [app的名字（不同的app可以有不同的处理函数，则不加，则可使用默认的处理方法）]
     * @param {[type]} options [session的存储配置（key, secret）]
    */

    addHandler: function(appName, options) {
      if (appName) {
        options = _.extend({}, defaultOptions, options);
        options.store = new RedisStore(redisOptions);
        return sessionHandleFunctions[appName] = express.session(options);
      }
    },
    /**
     * [getHandler 根据app获得处理函数]
     * @param  {[type]} appName [app的名字，若不添加，则默认为'all']
     * @return {[type]}         [description]
    */

    getHandler: function(appName) {
      if (appName == null) {
        appName = 'all';
      }
      return sessionHandleFunctions[appName];
    }
  };

  session.addHandler('all');

  module.exports = session;

}).call(this);
