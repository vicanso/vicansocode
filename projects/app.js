(function() {
  var appPath, cluster, config, domain, express, fileMerger, initApp, initExpress, logger, numCPUs, staticHandler, _;

  _ = require('underscore');

  express = require('express');

  cluster = require('cluster');

  domain = require('domain');

  config = require('./config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger");

  fileMerger = require("" + appPath + "/helpers/filemerger");

  staticHandler = require("" + appPath + "/helpers/statichandler");

  numCPUs = require('os').cpus().length;

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
    return app.listen(config.getListenPort());
  };

  /**
   * [initApp 初始化APP]
   * @return {[type]} [description]
  */


  initApp = function() {
    if (config.isProductionMode() && cluster.isMaster) {
      config.setMaster();
      while (numCPUs) {
        cluster.fork();
        numCPUs--;
      }
      return _.each('fork listen listening online disconnect exit'.split(' '), function(event) {
        return cluster.on(event, function(worker) {
          logger.error("worker " + worker.process.pid + " " + event);
          if (event === 'exit') {
            return cluster.fork();
          }
        });
      });
    } else {
      if (config.isProductionMode()) {
        domain = domain.create();
        domain.on('error', function(err) {
          return logger.error("uncaughtException " + err);
        });
        return domain.run(function() {
          return initExpress();
        });
      } else {
        fileMerger.mergeFilesBeforeRunning(true);
        return initExpress();
      }
    }
  };

  initApp();

}).call(this);
