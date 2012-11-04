
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appInfoParse, appPath, beforeRunningHandler, cluster, config, domain, express, fs, initApp, initExpress, logger, myUtil, pageError, slaveTotal, staticHandler, _;

  _ = require('underscore');

  express = require('express');

  cluster = require('cluster');

  domain = require('domain');

  fs = require('fs');

  config = require('./config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  beforeRunningHandler = require("" + appPath + "/helpers/beforerunninghandler");

  staticHandler = require("" + appPath + "/helpers/static");

  slaveTotal = config.getSlaveTotal();

  myUtil = require("" + appPath + "/helpers/util");

  appInfoParse = require("" + appPath + "/helpers/appinfoparse");

  pageError = require("" + appPath + "/helpers/pageerror");

  initExpress = function() {
    var app, startAppList, uid;
    app = express();
    app.set('views', "" + appPath + "/views");
    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
    uid = config.getUID();
    express.logger.token('node', function() {
      return "node:" + uid;
    });
    express.logger.format('production', ":node -- " + express.logger["default"] + " -- :response-time ms");
    app.use(staticHandler.handler());
    app.use(function(req, res, next) {
      var userAgent;
      userAgent = req.header('User-Agent');
      if (!userAgent) {
        return res.send('success');
      } else {
        return next();
      }
    });
    app.use(express.favicon("" + appPath + "/static/common/images/favicon.png"));
    if (!config.isProductionMode()) {
      app.use(express.logger('dev'));
    } else {
      app.use(express.limit('1mb'));
      app.use(express.logger('production'));
    }
    app.use(express.timeout(config.getResponseTimeout()));
    app.use(appInfoParse.handler());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(pageError.handler());
    startAppList = config.getStartAppList();
    if (startAppList === 'all') {
      fs.readdir("" + appPath + "/apps", function(err, files) {
        return _.each(files, function(appName) {
          if (appName[0] !== '.') {
            return require("" + appPath + "/apps/" + appName + "/init")(app);
          }
        });
      });
    } else {
      _.each(startAppList, function(appName) {
        return require("" + appPath + "/apps/" + appName + "/init")(app);
      });
    }
    app.listen(config.getListenPort());
    return logger.info("listen port " + (config.getListenPort()));
  };

  /**
   * [initApp 初始化APP]
   * @return {[type]} [description]
  */


  initApp = function() {
    if (config.isProductionMode() && config.isMaster()) {
      beforeRunningHandler.run();
      while (slaveTotal) {
        cluster.fork();
        slaveTotal--;
      }
      _.each('fork listening online'.split(' '), function(event) {
        return cluster.on(event, function(worker) {
          return logger.info("worker " + worker.process.pid + " " + event);
        });
      });
      return cluster.on('exit', function(worker) {
        logger.error("worker " + worker.process.pid + " " + event);
        return cluster.fork();
      });
    } else {
      beforeRunningHandler.run();
      if (config.isProductionMode()) {
        domain = domain.create();
        domain.on('error', function(err) {
          return logger.error(err);
        });
        return domain.run(function() {
          return initExpress();
        });
      } else {
        return initExpress();
      }
    }
  };

  initApp();

}).call(this);
