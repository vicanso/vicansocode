(function() {
  var appPath, config, getLogger, _;

  _ = require('underscore');

  config = require('../config');

  appPath = config.getAppPath();

  getLogger = function(runningFile) {
    var logger;
    return logger = require('log4js').getLogger(runningFile.replace(appPath, ''));
  };

  module.exports = getLogger;

}).call(this);
