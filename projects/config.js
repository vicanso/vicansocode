(function() {
  var APP_PATH, IS_MASTER, LISTEN_PORT, MERGE_FILES, RUNNING_MODE, STATIC_PATH, STATIC_PREFIX, TEMP_STATIC_PATH, TEMP_STATIC_PREFIX, config, path;

  path = require('path');

  APP_PATH = __dirname;

  RUNNING_MODE = process.env.NODE_ENV === 'production';

  STATIC_PREFIX = '/static';

  STATIC_PATH = path.join(APP_PATH, STATIC_PREFIX);

  TEMP_STATIC_PREFIX = STATIC_PREFIX + '/temp';

  TEMP_STATIC_PATH = path.join(APP_PATH, TEMP_STATIC_PREFIX);

  LISTEN_PORT = 10000;

  IS_MASTER = false;

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
      return RUNNING_MODE;
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
     * [isMaster 是否master]
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
    getMergeFiles: function() {
      return MERGE_FILES;
    }
  };

  module.exports = config;

}).call(this);
