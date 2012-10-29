(function() {
  var FileImporter, appPath, config, errorPageHandler, httpHandler, mongoClient, myUtil, routeInfos, user, userLoader, viewContentHandler, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  viewContentHandler = require("" + appPath + "/apps/vicanso/helpers/viewcontenthandler");

  FileImporter = require("" + appPath + "/helpers/fileimporter");

  httpHandler = require("" + appPath + "/helpers/httphandler");

  mongoClient = require("" + appPath + "/apps/vicanso/models/mongoclient");

  errorPageHandler = require("" + appPath + "/apps/vicanso/helpers/errorpagehandler");

  myUtil = require("" + appPath + "/helpers/util");

  user = require("" + appPath + "/helpers/user");

  userLoader = user.loader();

  routeInfos = [
    {
      type: 'get',
      route: '/vicanso',
      jadeView: 'vicanso/index',
      handerFunc: 'index'
    }, {
      type: 'get',
      route: '/vicanso/article/:id',
      middleware: [userLoader],
      jadeView: 'vicanso/article',
      handerFunc: 'article'
    }, {
      type: 'get',
      route: '/vicanso/admin/addarticle',
      jadeView: 'vicanso/admin/addarticle',
      handerFunc: 'addArticle'
    }, {
      type: 'post',
      route: '/vicanso/ajax/admin/addarticle',
      handerFunc: 'addArticle'
    }, {
      type: 'get',
      route: '/vicanso/admin/login',
      jadeView: 'vicanso/admin/login',
      handerFunc: 'login'
    }, {
      type: 'post',
      route: '/vicanso/ajax/admin/login',
      middleware: [userLoader],
      handerFunc: 'login'
    }, {
      type: 'get',
      route: '/vicanso/ajax/userbehavior/:behavior/:targetId',
      middleware: [userLoader],
      handerFunc: 'userBehavior'
    }
  ];

  module.exports = function(app) {
    _.each(routeInfos, function(routeInfo) {
      var middleware;
      middleware = routeInfo.middleware || [];
      return app[routeInfo.type](routeInfo.route, middleware, function(req, res) {
        var debug;
        debug = !config.isProductionMode();
        return viewContentHandler[routeInfo.handerFunc](req, res, function(viewData) {
          if (viewData) {
            if (routeInfo.jadeView) {
              viewData.fileImporter = new FileImporter(debug);
              return httpHandler.render(req, res, routeInfo.jadeView, viewData);
            } else {
              if (_.isObject(viewData)) {
                viewData = JSON.stringify(viewData);
              }
              return res.send(viewData);
            }
          } else {
            return errorPageHandler.response(500);
          }
        });
      });
    });
    app.get('/vicanso/nocacheinfo.js', userLoader, function(req, res) {
      return viewContentHandler.getNoCacheInfo(req, res, function(viewData) {
        return myUtil.response(res, viewData, 0, 'application/javascript');
      });
    });
    return app.get('/vicanso/updatenodemodules', function(req, res) {
      return viewContentHandler.updateNodeModules(res);
    });
  };

}).call(this);
