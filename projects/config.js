(function() {
  var APP_PATH, IS_MASTER, IS_PRODUCTION_MODE, LISTEN_PORT, MERGE_FILES, MONGO_INFO, REDIS_INFO, SLAVE_TOTAL, STATIC_PATH, STATIC_PREFIX, TEMP_STATIC_PATH, TEMP_STATIC_PREFIX, config, path;

  path = require('path');

  APP_PATH = __dirname;

  IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production';

  STATIC_PREFIX = '/static';

  STATIC_PATH = path.join(APP_PATH, STATIC_PREFIX);

  TEMP_STATIC_PREFIX = STATIC_PREFIX + '/temp';

  TEMP_STATIC_PATH = path.join(APP_PATH, TEMP_STATIC_PREFIX);

  LISTEN_PORT = 10000;

  REDIS_INFO = {
    port: 10010,
    host: '127.0.0.1'
  };

  MONGO_INFO = {
    port: 10020,
    host: '127.0.0.1',
    poolsize: 16
  };

  IS_MASTER = false;

  SLAVE_TOTAL = require('os').cpus().length;

  MERGE_FILES = require("" + APP_PATH + "/mergefiles.json");

  config = {
    /**
     * [getAppPath 返回APP的所在的目录]
     * @return {[type]} [description]
    */

    getAppPath: function() {
      return APP_PATH;
    },
    /**
     * [isProductionMode 判断当前APP是否运行在production环境下]
     * @return {Boolean} [description]
    */

    isProductionMode: function() {
      return IS_PRODUCTION_MODE;
    },
    /**
     * [getListenPort 返回APP的监听端口]
     * @return {[type]} [description]
    */

    getListenPort: function() {
      return LISTEN_PORT;
    },
    /**
     * [getStaticPrefix 返回静态文件请求的HTTP请缀]
     * @return {[type]} [description]
    */

    getStaticPrefix: function() {
      return STATIC_PREFIX;
    },
    getTempStaticPrefix: function() {
      return TEMP_STATIC_PREFIX;
    },
    /**
     * [setMaster 设置其为master]
    */

    setMaster: function() {
      return IS_MASTER = true;
    },
    /**
     * [isMaster 是否master，在程序运行之后才去设置，因此不要在require config之后就直接调用]
     * @return {Boolean} [description]
    */

    isMaster: function() {
      return IS_MASTER;
    },
    getStaticPath: function() {
      return STATIC_PATH;
    },
    /**
     * [getTempPath 获取临时目录，该目录存放css,js的合并文件]
     * @return {[type]} [description]
    */

    getTempPath: function() {
      return path.join(APP_PATH, TEMP_STATIC_PREFIX);
    },
    /**
     * [getMergeFiles 返回合并文件列表]
     * @return {[type]} [description]
    */

    getMergeFiles: function() {
      return MERGE_FILES;
    },
    /**
     * [getRedisPort 返回redis的一些配置信息]
     * @return {[type]} [description]
    */

    getRedisInfo: function() {
      return REDIS_INFO;
    },
    /**
     * [getMongoInfo 返回mongo一些配置信息]
     * @return {[type]} [description]
    */

    getMongoInfo: function() {
      return MONGO_INFO;
    },
    /**
     * [getSlaveTotal 返回从进程的总数]
     * @return {[type]} [description]
    */

    getSlaveTotal: function() {
      return SLAVE_TOTAL;
    }
  };

  module.exports = config;

}).call(this);
