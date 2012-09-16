(function() {
  var FileImporter, STATIC_PREFIX, VERSION, appPath, config, fileMerger, fs, myUtil, path, tempPath, _;

  _ = require('underscore');

  path = require('path');

  fs = require('fs');

  config = require('../config');

  appPath = config.getAppPath();

  tempPath = config.getTempPath();

  fileMerger = require("" + appPath + "/helpers/filemerger");

  myUtil = require("" + appPath + "/helpers/util");

  STATIC_PREFIX = config.getStaticPrefix();

  VERSION = new Date().getTime();

  FileImporter = (function() {
    /**
     * [constructor description]
     * @param  {[type]} debug [是否debug模式，debug模式下将.min.js替换为.js]
     * @return {[type]}       [description]
    */

    function FileImporter(debug) {
      this.cssFiles = [];
      this.jsFiles = [];
      this.debug = debug || false;
    }

    /**
     * [importCss description]
     * @param  {[type]} path     [css路径]
     * @param  {[type]} prepend [是否插入到数组最前（在HTML中首先输出）]
     * @return {[type]}         [description]
    */


    FileImporter.prototype.importCss = function(path, prepend) {
      var self;
      self = this;
      self.importFiles(path, 'css', prepend);
      return self;
    };

    /**
     * [importJs description]
     * @param  {[type]} path    [js路径]
     * @param  {[type]} prepend [是否插入到数组最前（在HTML中首先输出）]
     * @return {[type]}         [description]
    */


    FileImporter.prototype.importJs = function(path, prepend) {
      var self;
      self = this;
      self.importFiles(path, 'js', prepend);
      return self;
    };

    /**
     * [importFiles description]
     * @param  {[type]} path    [文件路径]
     * @param  {[type]} type    [文件类型(css, js)]
     * @param  {[type]} prepend [是否插入到数组最前（在HTML中首先输出）]
     * @return {[type]}         [description]
    */


    FileImporter.prototype.importFiles = function(path, type, prepend) {
      var mergerFile, self;
      self = this;
      if (_.isString(path)) {
        path = path.trim();
        if (!self.debug) {
          mergerFile = fileMerger.getMergeFile(path, type);
          if (mergerFile) {
            path = mergerFile;
          }
        }
        if (type === 'css') {
          if (_.indexOf(self.cssFiles, path) === -1) {
            if (prepend) {
              self.cssFiles.unshift(path);
            } else {
              self.cssFiles.push(path);
            }
          }
        } else if (_.indexOf(self.jsFiles, path) === -1) {
          if (prepend) {
            self.jsFiles.unshift(path);
          } else {
            self.jsFiles.push(path);
          }
        }
      } else if (_.isArray(path)) {
        if (prepend) {
          path.reverse();
        }
        _.each(path, function(item) {
          return self.importFiles(item, type, prepend);
        });
      }
      return self;
    };

    /**
     * [exportCss description]
     * @param  {[type]} merge [description]
     * @return {[type]}       [description]
    */


    FileImporter.prototype.exportCss = function(merge) {
      var cssFileList, linkFileName, mergeFiles, saveFile, self;
      self = this;
      cssFileList = [];
      mergeFiles = [];
      _.each(self.cssFiles, function(cssFile) {
        if (cssFile.indexOf('http') !== 0) {
          cssFile = path.join(STATIC_PREFIX, cssFile);
          mergeFiles.push(path.join(appPath, cssFile));
        }
        return cssFileList.push('<link rel="stylesheet" href="' + cssFile + ("?version=" + VERSION) + '" type="text/css" media="screen" />');
      });
      if (!merge) {
        return cssFileList.join('');
      }
      linkFileName = myUtil.sha1(mergeFiles.join('')) + '.css';
      saveFile = path.join(tempPath, linkFileName);
      if (fs.existsSync(saveFile)) {
        linkFileName = path.join(config.getTempStaticPrefix(), linkFileName);
        return '<link rel="stylesheet" href="' + linkFileName + ("?version=" + VERSION) + '" type="text/css" media="screen" />';
      } else {
        myUtil.mergeFiles(mergeFiles, saveFile);
        return cssFileList.join('');
      }
    };

    FileImporter.prototype.exportJs = function(merge) {
      var jsFileList, self;
      self = this;
      jsFileList = [];
      _.each(self.jsFiles, function(jsFile) {
        if (self.debug) {
          jsFile = ('' + jsFile).replace('.min.js', '.js');
        }
        if (jsFile.indexOf('http') !== 0) {
          jsFile = path.join(STATIC_PREFIX, jsFile) + ("?version=" + VERSION);
        }
        return jsFileList.push('<script type="text/javascript" src="' + jsFile + '"></script>');
      });
      return jsFileList.join('');
    };

    return FileImporter;

  })();

  module.exports = FileImporter;

}).call(this);
