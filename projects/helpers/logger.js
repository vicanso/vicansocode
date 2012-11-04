
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appPath, config, getLogger, uid, _;

  _ = require('underscore');

  config = require('../config');

  appPath = config.getAppPath();

  uid = config.getUID();

  /**
   * [getLogger 返回logger对象（输出信息包含调用该logger的文件名）]
   * @param  {[type]} runningFile [description]
   * @return {[type]}             [description]
  */


  getLogger = function(runningFile) {
    var logger, loggerFile;
    loggerFile = runningFile.replace(appPath, '');
    return logger = require('log4js').getLogger("node:" + uid + " " + loggerFile);
  };

  module.exports = getLogger;

}).call(this);
