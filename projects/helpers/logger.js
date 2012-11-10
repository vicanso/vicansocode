
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appPath, config, getLogger, log4js, uid, _;

  _ = require('underscore');

  log4js = require('log4js');

  config = require('../config');

  appPath = config.getAppPath();

  uid = config.getUID();

  log4js.loadAppender('file');

  /**
   * [getLogger 返回logger对象（输出信息包含调用该logger的文件名）]
   * @param  {[type]} runningFile [description]
   * @return {[type]}             [description]
  */


  getLogger = function(runningFile) {
    var errorLog, logger, loggerFile;
    loggerFile = runningFile.replace(appPath, '');
    logger = log4js.getLogger("node:" + uid + " " + loggerFile);
    errorLog = logger.error;
    logger.error = function(msg) {
      var args, err, infos;
      args = _.toArray(arguments);
      err = new Error();
      infos = err.stack.split('\n')[2];
      console.log(infos.trim());
      args.unshift(infos.trim().replace(appPath, ''));
      return errorLog.apply(logger, args);
    };
    return logger;
  };

  module.exports = getLogger;

}).call(this);
