(function() {
  var FileImporter, STATIC_PREFIX, VERSION, appPath, config, fileMerger, fs, path, _;

  _ = require('underscore');

  path = require('path');

  fs = require('fs');

  config = require('../config');

  appPath = config.getAppPath();

  fileMerger = require("" + appPath + "/helpers/filemerger");

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
     * [importCss 引入css文件]
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
     * [importJs 引入js文件]
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
      var cssFileList, linkFileName, mergeFiles, self;
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
      if (!merge || self.debug) {
        return cssFileList.join('');
      }
      linkFileName = fileMerger.mergeFilesToTemp(mergeFiles, 'css');
      if (linkFileName) {
        linkFileName = path.join(config.getTempStaticPrefix(), linkFileName);
        return '<link rel="stylesheet" href="' + linkFileName + ("?version=" + VERSION) + '" type="text/css" media="screen" />';
      } else {
        return cssFileList.join('');
      }
    };

    FileImporter.prototype.exportJs = function(merge) {
      var jsFileList, linkFileName, mergeFiles, self;
      self = this;
      jsFileList = [];
      mergeFiles = [];
      _.each(self.jsFiles, function(jsFile) {
        if (self.debug) {
          jsFile = ('' + jsFile).replace('.min.js', '.js');
        }
        if (jsFile.indexOf('http') !== 0) {
          jsFile = path.join(STATIC_PREFIX, jsFile) + ("?version=" + VERSION);
          mergeFiles.push(path.join(appPath, jsFile));
        }
        return jsFileList.push('<script type="text/javascript" src="' + jsFile + '"></script>');
      });
      if (!merge || self.debug) {
        return jsFileList.join('');
      }
      linkFileName = fileMerger.mergeFilesToTemp(mergeFiles, 'js');
      if (linkFileName) {
        linkFileName = path.join(config.getTempStaticPrefix(), linkFileName);
        return '<script type="text/javascript" src="' + linkFileName + ("?version=" + VERSION) + '"></script>';
      } else {
        return jsFileList.join('');
      }
    };

    return FileImporter;

  })();

  module.exports = FileImporter;

}).call(this);
