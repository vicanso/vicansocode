(function() {
  var FileImporter, appPath, config, errorPageHandler, httpHandler, mongoClient, routeInfos, session, sessionHandler, viewContentHandler, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  viewContentHandler = require("" + appPath + "/apps/vicanso/helpers/viewcontenthandler");

  FileImporter = require("" + appPath + "/helpers/fileimporter");

  httpHandler = require("" + appPath + "/helpers/httphandler");

  mongoClient = require("" + appPath + "/apps/vicanso/models/mongoclient");

  errorPageHandler = require("" + appPath + "/apps/vicanso/helpers/errorpagehandler");

  session = require("" + appPath + "/helpers/session");

  sessionHandler = session.handler();

  routeInfos = [
    {
      type: 'get',
      route: '/vicanso',
      jadeView: 'vicanso/index',
      handerFunc: 'index'
    }, {
      type: 'get',
      route: '/vicanso/article/:id',
      jadeView: 'vicanso/article',
      handerFunc: 'article'
    }, {
      type: 'all',
      route: '/vicanso/admin/addarticle',
      jadeView: 'vicanso/admin/addarticle',
      handerFunc: 'addArticle'
    }, {
      type: 'all',
      route: '/vicanso/admin/login',
      jadeView: 'vicanso/admin/login',
      handerFunc: 'login'
    }
  ];

  module.exports = function(app) {
    _.each(routeInfos, function(routeInfo) {
      return app[routeInfo.type](routeInfo.route, function(req, res) {
        var debug;
        debug = !config.isProductionMode();
        return viewContentHandler[routeInfo.handerFunc](req, res, function(viewData) {
          if (viewData) {
            viewData.fileImporter = new FileImporter(debug);
            return httpHandler.render(req, res, routeInfo.jadeView, viewData);
          } else {
            return errorPageHandler.response(500);
          }
        });
      });
    });
    app.get('/vicanso/ajax/*', function(req, res) {
      return res.send('success');
    });
    app.get('/vicanso/nocacheinfo.js', sessionHandler, function(req, res) {
      res.header('Content-Type', 'application/javascript; charset=UTF-8');
      res.header('Cache-Control', 'no-cache, no-store, max-age=0');
      return res.send("var USER_INFO = {};");
    });
    return app.get('/vicanso/updatenodemodules', function(req, res) {
      return viewContentHandler.updateNodeModules(res);
    });
  };

}).call(this);
