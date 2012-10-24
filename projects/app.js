(function() {
  var appInfoParse, appPath, beforeRunningHandler, cluster, config, domain, express, initApp, initExpress, logger, myUtil, session, slaveTotal, staticHandler, _;

  _ = require('underscore');

  express = require('express');

  cluster = require('cluster');

  domain = require('domain');

  config = require('./config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  beforeRunningHandler = require("" + appPath + "/helpers/beforerunninghandler");

  staticHandler = require("" + appPath + "/helpers/staticHandler");

  slaveTotal = config.getSlaveTotal();

  myUtil = require("" + appPath + "/helpers/util");

  session = require("" + appPath + "/helpers/session");

  appInfoParse = require("" + appPath + "/helpers/appinfoparse");

  initExpress = function() {
    var app;
    app = express();
    app.set('views', "" + appPath + "/views");
    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
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
    if (!config.isProductionMode()) {
      app.use(express.responseTime());
    } else {
      app.use(express.limit('1mb'));
      app.use(express.logger());
    }
    app.use(appInfoParse.handler());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(function(req, res, next) {
      logger.info(req.query);
      return next();
    });
    app.use(session.handler());
    app.use(function(req, res, next) {
      var sess;
      logger.info('2:');
      sess = req.session;
      logger.info(sess);
      if (sess.views) {
        sess.views++;
      } else {
        sess.views = 1;
      }
      return next();
    });
    app.use(app.router);
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    require("" + appPath + "/apps/vicanso/init")(app);
    require("" + appPath + "/apps/ys/init")(app);
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
