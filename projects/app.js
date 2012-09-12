(function() {
  var cluster, config, domain, express, gzippo, initApp, numCPUs, _;

  _ = require('underscore');

  express = require('express');

  gzippo = require('gzippo');

  cluster = require('cluster');

  domain = require('domain');

  config = require('./config');

  numCPUs = require('os').cpus().length;

  /**
   * [initApp 初始化APP]
   * @return {[type]} [description]
  */


  initApp = function() {
    if (cluster.isMaster) {
      while (numCPUs) {
        cluster.fork();
        numCPUs--;
      }
      return _.each('fork listen listening online disconnect exit'.split(' '), function(event) {
        return cluster.on(event, function(worker) {
          console.log("worker " + worker.process.pid + " " + event);
          if (event === 'exit') {
            return cluster.fork();
          }
        });
      });
    } else {
      domain = domain.create();
      domain.on('error', function(err) {
        return console.error(err);
      });
      return domain.run(function() {
        var app, appPath;
        appPath = config.getAppPath();
        app = express();
        app.set('views', "" + appPath + "/views");
        app.engine('jade', require('jade').__express);
        app.use(gzippo.staticGzip("" + appPath + "/static", {
          clientMaxAge: 60 * 60 * 1000,
          prefix: "" + (config.getStaticPrefix()) + "/"
        }));
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
      });
    }
  };

  initApp();

}).call(this);
