(function() {
  var appPath, client, config, initRedisClient, logRedisReady, logger, redisClient, redisPort, _;

  config = require('../config');

  _ = require('underscore');

  appPath = config.getAppPath();

  redisPort = config.getRedisPort();

  client = require('redis').createClient(redisPort);

  logger = require("" + appPath + "/helpers/logger")(__filename);

  /**
   * [initRedisClient 初始化redis client，将原来client的函数添加到redisClient中，增加对client的调用会先判断是否已连接]
   * @param  {[type]} redisClient [新的redis client]
   * @param  {[type]} client      [原有的redis client]
  */


  initRedisClient = function(redisClient, client) {
    var functions;
    functions = _.functions(client);
    return _.each(functions, function(func, i) {
      return redisClient[func] = function() {
        var args, cbf;
        args = Array.prototype.slice.call(arguments);
        if (client.connected) {
          return client[func].apply(client, args);
        } else {
          cbf = args.pop();
          if (_.isFunction(cbf)) {
            return cbf({
              code: -1,
              msg: 'redis is not connected'
            });
          }
        }
      };
    });
  };

  logRedisReady = true;

  client.on('ready', function(err) {
    if (err) {
      logger.error("redis.js redis ready event: " + (JSON.stringify(err)));
      logRedisReady = true;
    }
    if (logRedisReady) {
      logger.info('redis ready');
      return logRedisReady = false;
    }
  });

  client.on('error', function(err) {
    if (err) {
      logger.error("redis.js redis error event: " + (JSON.stringify(err)));
    }
    return logRedisReady = true;
  });

  redisClient = {};

  initRedisClient(redisClient, client);

  module.exports = redisClient;

}).call(this);
