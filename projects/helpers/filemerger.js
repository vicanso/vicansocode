(function() {
  var Merger, fs, mkdirp, path, _;

  _ = require('underscore');

  path = require('path');

  fs = require('fs');

  mkdirp = require('mkdirp');

  Merger = {
    getMergeFile: function(file, type) {
      var mergeFile, searchFiles, self;
      self = this;
      mergeFile = '';
      if (type === 'css') {
        searchFiles = self.cssList;
      } else {
        searchFiles = self.jsList;
      }
      _.each(searchFiles, function(files) {
        if (!mergeFile && (_.indexOf(files, file)) !== -1) {
          return mergeFile = files[0];
        }
      });
      return mergeFile;
    },
    /**
     * [mergeFiles 合并文件]
     * @param  {[type]} mergingFiles [是否真实作读取文件合并的操作（由于有可能有多个worker进程，因此只需要主进程作真正的读取，合并扣件，其它的只需要整理合并列表）]
     * @return {[type]}              [description]
    */

    mergeFiles: function(mergingFiles) {
      var self;
      self = this;
      _.each(self, function(mergerInfo, mergerType) {
        var mergeList;
        if (_.isArray(mergerInfo)) {
          mergeList = [];
          _.each(mergerInfo, function(mergers) {
            var combineFileName, fileName, filePathList;
            fileName = 'vicanso';
            combineFileName = '';
            filePathList = [];
            _.each(mergers, function(fileInfo, key) {
              fileName += "_" + key;
              if (key === 'combine') {
                return combineFileName = fileInfo.file;
              } else if (fileInfo.index != null) {
                return filePathList[fileInfo.index] = fileInfo.file;
              }
            });
            if (filePathList.length !== 0) {
              if (combineFileName) {
                fileName = combineFileName;
              } else {
                fileName = "/mergers/" + fileName + "." + mergerType;
              }
              return mergeList.push([fileName].concat(_.compact(filePathList)));
            }
          });
          if (mergingFiles) {
            _.each(mergeList, function(files) {
              var content, filePath, saveFile;
              filePath = "" + (path.dirname(__dirname)) + "/static/";
              saveFile = path.join(filePath, files[0]);
              content = '';
              _.each(files, function(file, i) {
                if (i !== 0) {
                  return content += fs.readFileSync(path.join(filePath, file));
                }
              });
              return mkdirp(path.dirname(saveFile), function(err) {
                if (err) {
                  logger.error(err);
                }
                return fs.writeFileSync(saveFile, content);
              });
            });
          }
          return self["" + mergerType + "List"] = mergeList;
        }
      });
      delete self.js;
      return delete self.css;
    },
    js: [
      {
        combine: {
          file: '/mergers/jquery.plugins.min.js'
        },
        cookies: {
          file: '/common/javascripts/jquery/jquery.cookies.min.js',
          index: 0
        },
        url: {
          file: '/common/javascripts/jquery/jquery.url.min.js',
          index: 1
        },
        mousewheel: {
          file: '/common/javascripts/jquery/jquery.mousewheel.min.js',
          index: 2
        }
      }
    ],
    css: []
  };

  module.exports = Merger;

}).call(this);
