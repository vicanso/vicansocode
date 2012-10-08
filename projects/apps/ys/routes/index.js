(function() {
  var FileImporter, appPath, commodityModify, config, home, httpHandler, initScore, logger, mongoClient, saveCommodityHandler, viewContentHandler, viewDataHandler;

  config = require('../../../config');

  appPath = config.getAppPath();

  viewContentHandler = require("" + appPath + "/apps/ys/helpers/viewcontenthandler");

  FileImporter = require("" + appPath + "/helpers/fileimporter");

  httpHandler = require("" + appPath + "/helpers/httphandler");

  mongoClient = require("" + appPath + "/apps/ys/models/mongoclient");

  viewDataHandler = require("" + appPath + "/apps/ys/helpers/viewdatahandler");

  logger = require("" + appPath + "/helpers/logger")(__filename);

  module.exports = function(app) {
    app.get('/ys/javascripts/info.min.js', function(req, res) {
      var info;
      info = {
        host: req.host,
        paths: {
          home: '/ys'
        }
      };
      res.header('Content-Type', 'application/javascript');
      return res.send("var INFO = " + (JSON.stringify(info)));
    });
    app.get('/ys', home);
    app.get('/ys/page/:page', home);
    app.get('/ys/tag/:tag/page/:page', home);
    app.get('/ys/tag/:tag', home);
    app.get('/ys', home);
    app.get('/ys/commoditymodify/:id', commodityModify);
    app.post('/ys/action/savecommodity', saveCommodityHandler);
    return app.get('/ys/initscore', initScore);
  };

  initScore = function(req, res, next) {
    return viewDataHandler.initScore(function(err, data) {
      return res.send('success');
    });
  };

  saveCommodityHandler = function(req, res, next) {
    var data, id;
    data = req.body;
    id = data._id;
    delete data._id;
    data.modifiedTime = new Date();
    data.price = data.price || 0;
    console.dir(data);
    return viewDataHandler.save(id, data, function(err, data) {
      console.log("err:" + err);
      if (err) {
        data = {
          code: 1000,
          msg: err.toString()
        };
      } else {
        data = {
          code: 0,
          msg: 'success'
        };
      }
      return res.send(JSON.stringify(data));
    });
  };

  commodityModify = function(req, res, next) {
    var id;
    id = req.params.id;
    return viewDataHandler.commodity(id, function(err, data) {
      var debug, fileImporter, jadeView, view, viewData;
      console.dir(data);
      if (err) {
        return res.render('error', 504);
      } else {
        view = 'ys/commodity_modify';
        jadeView = 'ys/commodity_modify';
        debug = !config.isProductionMode();
        fileImporter = new FileImporter(debug);
        viewData = viewContentHandler.commodityModify(fileImporter, data);
        return httpHandler.render(req, res, jadeView, viewData);
      }
    });
  };

  home = function(req, res, next) {
    var currentPage, eachPageTotal, options, params, query, tag, title;
    params = req.params;
    currentPage = global.parseInt(params.page || 1);
    tag = params.tag;
    title = req.query.title;
    eachPageTotal = 30;
    options = {
      sort: {
        score: -1
      },
      limit: eachPageTotal,
      skip: eachPageTotal * (currentPage - 1)
    };
    if (tag) {
      query = {
        tags: {
          $all: [tag]
        }
      };
    } else if (title) {
      query = {
        title: title
      };
    } else {
      query = {};
    }
    return viewDataHandler.home(query, options, function(err, result) {
      var debug, fileImporter, jadeView, pageConfig, viewData;
      logger.info(result.data);
      if (err) {
        return res.render('error', 504);
      } else {
        pageConfig = {
          currentPage: currentPage,
          eachPageTotal: eachPageTotal,
          total: result.total
        };
        jadeView = 'ys/home';
        debug = !config.isProductionMode();
        fileImporter = new FileImporter(debug);
        viewData = viewContentHandler.home(fileImporter, result.data, pageConfig, tag);
        return httpHandler.render(req, res, jadeView, viewData);
      }
    });
  };

}).call(this);
