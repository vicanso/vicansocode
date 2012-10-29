(function() {
  var APP_NAME, CONNECT_STRING, DB_NAME, config, mongoInfo;

  config = require('../../config');

  DB_NAME = 'vicanso';

  APP_NAME = 'vicanso';

  mongoInfo = config.getMongoInfo();

  CONNECT_STRING = "mongodb://" + (config.getDataBaseUser()) + ":" + (config.getDatabasePassword()) + "@" + mongoInfo.host + ":" + mongoInfo.port + "/" + DB_NAME;

  config = {
    /**
     * [getAppName 返回app的名字]
     * @return {[type]} [description]
    */

    getAppName: function() {
      return APP_NAME;
    },
    /**
     * [getConnectionStr 获取数据库连接字符串]
     * @return {[type]} [description]
    */

    getConnectionStr: function() {
      return CONNECT_STRING;
    },
    /**
     * [getDataBaseName 获取数据库名称]
     * @return {[type]} [description]
    */

    getDataBaseName: function() {
      return DB_NAME;
    }
  };

  module.exports = config;

}).call(this);
