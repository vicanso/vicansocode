
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var APP_PATH, CACHE_QUERY_RESULT, DATA_BASE_PWD, DATA_BASE_USER, IS_MASTER, IS_PRODUCTION_MODE, LISTEN_PORT, LOGGER_QUERY_INFO, MERGE_FILES, MONGO_INFO, REDIS_INFO, SLAVE_TOTAL, STATIC_FILE_MAX_AGE, STATIC_PATH, STATIC_PREFIX, TEMP_STATIC_PATH, TEMP_STATIC_PREFIX, VARNISH_INFO, cluster, commander, config, initArguments, path;

  path = require('path');

  cluster = require('cluster');

  commander = require('commander');

  /**
   * [initArguments 初始化启动参数]
   * @param  {[type]} program [commander模块]
   * @return {[type]}         [description]
  */


  initArguments = function(program) {
    return program.version('0.0.1').option('-p, --port <n>', 'listen port', parseInt).option('-s, --slave <n>', 'slave total', parseInt).option('-u, --user <n>', 'database user').option('-w, --password <n>', 'database password').parse(process.argv);
  };

  initArguments(commander);

  APP_PATH = __dirname;

  IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production';

  STATIC_PREFIX = '/static';

  STATIC_FILE_MAX_AGE = 15 * 60;

  STATIC_PATH = path.join(APP_PATH, STATIC_PREFIX);

  TEMP_STATIC_PREFIX = STATIC_PREFIX + '/temp';

  TEMP_STATIC_PATH = path.join(APP_PATH, TEMP_STATIC_PREFIX);

  LISTEN_PORT = commander.port || 10000;

  REDIS_INFO = {
    port: 10010,
    host: '127.0.0.1'
  };

  MONGO_INFO = {
    port: 10020,
    host: '127.0.0.1',
    poolsize: 16
  };

  VARNISH_INFO = {
    managementPort: 10030,
    host: '127.0.0.1'
  };

  IS_MASTER = cluster.isMaster || false;

  SLAVE_TOTAL = commander.slave || require('os').cpus().length;

  DATA_BASE_USER = commander.user;

  DATA_BASE_PWD = commander.password;

  MERGE_FILES = require("" + APP_PATH + "/mergefiles.json");

  LOGGER_QUERY_INFO = true;

  CACHE_QUERY_RESULT = true;

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
    /**
     * [getTempStaticPrefix 返回临时文件目录的前缀（该目录主要用于保存网页中的所有css,js合并文件）]
     * @return {[type]} [description]
    */

    getTempStaticPrefix: function() {
      return TEMP_STATIC_PREFIX;
    },
    /**
     * [isMaster 是否master，在程序运行之后才去设置，因此不要在require config之后就直接调用]
     * @return {Boolean} [description]
    */

    isMaster: function() {
      return IS_MASTER;
    },
    /**
     * [getStaticPath 返回静态文件路径]
     * @return {[type]} [description]
    */

    getStaticPath: function() {
      return STATIC_PATH;
    },
    /**
     * [getStaticFileMaxAge 返回静态文件的HTTP缓存时间，以second为单位]
     * @return {[type]} [description]
    */

    getStaticFileMaxAge: function() {
      return STATIC_FILE_MAX_AGE;
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
    },
    /**
     * [getVarnishInfo 获取varnish的一些配置信息]
     * @return {[type]} [description]
    */

    getVarnishInfo: function() {
      return VARNISH_INFO;
    },
    /**
     * [isLoggerQueryInfo 是否记录查询的Query信息]
     * @return {Boolean} [description]
    */

    isLoggerQueryInfo: function() {
      return LOGGER_QUERY_INFO;
    },
    /**
     * [isCacheQueryResult 是否缓存query结果]
     * @return {Boolean} [description]
    */

    isCacheQueryResult: function() {
      return CACHE_QUERY_RESULT;
    },
    /**
     * [getDatabasePassword 返回数据库的密码]
     * @return {[type]} [description]
    */

    getDatabasePassword: function() {
      return DATA_BASE_PWD;
    },
    /**
     * [getDataBaseUser 返回数据库的用户名]
     * @return {[type]} [description]
    */

    getDataBaseUser: function() {
      return DATA_BASE_USER;
    },
    /**
     * [getUID 获取node的uid(如果是master则返回0)]
     * @return {[type]} [description]
    */

    getUID: function() {
      var _ref;
      if (IS_MASTER) {
        return 0;
      } else {
        return (_ref = cluster.worker) != null ? _ref.uniqueID : void 0;
      }
    }
  };

  module.exports = config;

}).call(this);
