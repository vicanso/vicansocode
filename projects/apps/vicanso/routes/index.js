(function() {
  var FileImporter, appPath, config, errorPageHandler, httpHandler, mongoClient, routeInfos, viewContentHandler, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  viewContentHandler = require("" + appPath + "/apps/vicanso/helpers/viewcontenthandler");

  FileImporter = require("" + appPath + "/helpers/fileimporter");

  httpHandler = require("" + appPath + "/helpers/httphandler");

  mongoClient = require("" + appPath + "/apps/vicanso/models/mongoclient");

  errorPageHandler = require("" + appPath + "/apps/vicanso/helpers/errorpagehandler");

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
    }
  ];

  module.exports = function(app) {
    _.each(routeInfos, function(routeInfo) {
      return app[routeInfo.type](routeInfo.route, function(req, res) {
        var debug, fileImporter;
        debug = !config.isProductionMode();
        fileImporter = new FileImporter(debug);
        return viewContentHandler[routeInfo.handerFunc](req, fileImporter, function(viewData) {
          if (viewData) {
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
    app.get('/vicanso/nocacheinfo.js', function(req, res) {
      res.header('Content-Type', 'application/javascript; charset=UTF-8');
      res.header('Cache-Control', 'no-cache, no-store, max-age=0');
      return res.send("var USER_INFO = {};");
    });
    return app.get('/vicanso/updatenodemodules', function(req, res) {
      return viewContentHandler.updateNodeModules(res);
    });
  };

}).call(this);
