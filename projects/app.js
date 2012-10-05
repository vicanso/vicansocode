(function() {
  var appPath, beforeRunningHandler, cluster, config, domain, express, initApp, initExpress, logger, slaveTotal, staticHandler, _;

  _ = require('underscore');

  express = require('express');

  cluster = require('cluster');

  domain = require('domain');

  config = require('./config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  beforeRunningHandler = require("" + appPath + "/helpers/beforerunninghandler");

  staticHandler = require("" + appPath + "/helpers/statichandler");

  slaveTotal = config.getSlaveTotal();

  initExpress = function() {
    var app;
    app = express();
    app.set('views', "" + appPath + "/views");
    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
    app.use(express.responseTime());
    app.use(staticHandler["static"]());
    if (config.isProductionMode()) {
      app.use(express.logger());
    }
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    require("" + appPath + "/apps/vicanso/routes")(app);
    require("" + appPath + "/apps/ys/routes")(app);
    app.listen(config.getListenPort());
    return logger.info("listen port " + (config.getListenPort()));
  };

  /**
   * [initApp 初始化APP]
   * @return {[type]} [description]
  */


  initApp = function() {
    if (config.isProductionMode() && cluster.isMaster) {
      config.setMaster();
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
