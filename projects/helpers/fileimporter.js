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
      this.cssFIles = [];
      this.jsFiles = [];
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
          mergerFile = fileMerger.getMergerFile(path, type);
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
     * @return {[type]} [description]
    */


    FileImporter.prototype.exportCss = function() {
      var cssFileList, self;
      self = this;
      cssFileList = [];
      _.each(self.cssFiles, function(cssFile) {
        if (cssFile.indexOf('http') !== 0) {
          cssFile = Path.join(staticPrefix, cssFile) + ("?version=" + version);
        }
        return cssFileList.push('<link rel="stylesheet" href="' + cssFile + '" type="text/css" media="screen" />');
      });
      return cssFileList.join('');
    };

    FileImporter.prototype.exportJs = function() {
      var jsFileList, self;
      self = this;
      jsFileList = [];
      _.each(self.jsFiles, function(jsFile) {
        if (self.debug) {
          jsFile = ('' + jsFile).replace('.min.js', '.js');
        }
        if (jsFile.indexOf('http') !== 0) {
          jsFile = Path.join(staticPrefix, jsFile) + ("?version=" + version);
        }
        return jsFileList.push('<script type="text/javascript" src="' + jsFile + '"></script>');
      });
      return jsFileList.join('');
    };

    return FileImporter;

  })();

  module.exports = FileImporter;

}).call(this);
