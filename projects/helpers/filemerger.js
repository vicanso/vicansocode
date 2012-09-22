(function() {
  var appPath, config, fileMerger, fs, mkdirp, myUtil, path, staticPath, tempFilesStatus, tempPath, _;

  _ = require('underscore');

  path = require('path');

  fs = require('fs');

  mkdirp = require('mkdirp');

  config = require('../config');

  appPath = config.getAppPath();

  tempPath = config.getTempPath();

  staticPath = config.getStaticPath();

  myUtil = require("" + appPath + "/helpers/util");

  tempFilesStatus = {};

  fileMerger = {
    /**
     * [getMergeFile 根据当前文件返回合并对应的文件名，若该文件未被合并，则返回空字符串]
     * @param  {[type]} file [当前文件]
     * @param  {[type]} type [文件类型]
     * @return {[type]}      [返回合并后的文件名]
    */

    getMergeFile: function(file, type) {
      var mergeFile, searchFiles, self;
      self = this;
      mergeFile = '';
      if (type === 'css') {
        searchFiles = self.cssList;
      } else {
        searchFiles = self.jsList;
      }
      _.each(searchFiles, function(searchInfo) {
        var files;
        files = searchInfo.files;
        if (!mergeFile && (_.indexOf(files, file, true)) !== -1) {
          return mergeFile = searchInfo.name;
        }
      });
      return mergeFile;
    },
    /**
     * [mergeFilesBeforeRunning 合并文件(在程序运行之前，主要是把一些公共的文件合并成一个，减少HTTP请求)]
     * @param  {[type]} mergingFiles [是否真实作读取文件合并的操作（由于有可能有多个worker进程，因此只需要主进程作真正的读取，合并扣件，其它的只需要整理合并列表）]
     * @return {[type]}              [description]
    */

    mergeFilesBeforeRunning: function(mergingFiles) {
      var mergeFiles, self;
      self = this;
      mergeFiles = config.getMergeFiles();
      return _.each(mergeFiles, function(mergerInfo, mergerType) {
        var mergeList;
        if (_.isArray(mergerInfo)) {
          mergeList = [];
          _.each(mergerInfo, function(mergers) {
            return mergeList.push(mergers);
          });
          if (mergingFiles) {
            _.each(mergeList, function(mergers) {
              var content, saveFile;
              saveFile = path.join(staticPath, mergers.name);
              content = [];
              _.each(mergers.files, function(file, i) {
                return content.push(fs.readFileSync(path.join(staticPath, file), 'utf8'));
              });
              mkdirp(path.dirname(saveFile), function(err) {
                var fileSplit;
                if (err) {
                  logger.error(err);
                }
                fileSplit = '';
                if (mergerType === 'js') {
                  fileSplit = ';';
                }
                return fs.writeFileSync(saveFile, content.join(fileSplit));
              });
              return mergers.files.sort();
            });
          }
          return self["" + mergerType + "List"] = mergeList;
        }
      });
    },
    /**
     * [mergeFilesToTemp 将文件合并到临时文件夹，合并的文件根据所有文件的文件名通过sha1生成，若调用的时候，该文件已生成，则返回文件名，若未生成，则返回空字符串]
     * @param  {[type]} mergeFiles [合并文件列表]
     * @param  {[type]} type       [文件类型（用于作为文件后缀）]
     * @return {[type]}            [合并后的文件名]
    */

    mergeFilesToTemp: function(mergeFiles, type) {
      var linkFileHash, linkFileName, saveFile;
      mergeFiles = _.filter(mergeFiles, function(file) {
        return fileMerger.getMergeFile(file, type) === '';
      });
      linkFileHash = myUtil.sha1(mergeFiles.join(''));
      linkFileName = "" + linkFileHash + "." + type;
      saveFile = path.join(tempPath, linkFileName);
      if (tempFilesStatus[linkFileHash] === 'complete') {
        return linkFileName;
      } else {
        if (!tempFilesStatus[linkFileHash]) {
          tempFilesStatus[linkFileHash] = 'merging';
          myUtil.mergeFiles(mergeFiles, saveFile, function(data, file, saveFile) {
            var imagesPath;
            imagesPath = path.relative(path.dirname(saveFile), path.dirname(file));
            imagesPath = path.join(imagesPath, '../images');
            data = data.replace(/..\/images/g, imagesPath);
            return data;
          }, function(err) {
            if (err) {
              return logger.error(err);
            } else {
              return tempFilesStatus[linkFileHash] = 'complete';
            }
          });
        }
        return '';
      }
    }
  };

  module.exports = fileMerger;

}).call(this);
