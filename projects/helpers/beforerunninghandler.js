(function() {
  var appPath, config, fileMerger, fs, isProductionMode, logger, path, removeTempPathFiles, run, _;

  fs = require('fs');

  _ = require('underscore');

  path = require('path');

  config = require('../config');

  appPath = config.getAppPath();

  fileMerger = require("" + appPath + "/helpers/filemerger");

  logger = require("" + appPath + "/helpers/logger")(__filename);

  isProductionMode = config.isProductionMode();

  /**
   * [run 在node的http启动前作的一些操作，合并静态文件等]
   * @return {[type]}
  */


  run = function() {
    var isMaster;
    isMaster = config.isMaster();
    if (isProductionMode && isMaster) {
      return removeTempPathFiles();
    } else {
      return fileMerger.mergeFilesBeforeRunning(true);
    }
  };

  /**
   * [removeTempPathFiles 删除临时目录下的所有文件]
   * @return {[type]} [description]
  */


  removeTempPathFiles = function() {
    var tempPath;
    tempPath = config.getTempPath();
    return fs.readdir(tempPath, function(err, tempFiles) {
      if (err) {
        return logger.error(err);
      } else {
        return _.each(tempFiles, function(file) {
          return fs.unlink(path.join(tempPath, file), function(err) {
            if (err) {
              return logger.error(err);
            }
          });
        });
      }
    });
  };

  module.exports = {
    run: run
  };

}).call(this);
