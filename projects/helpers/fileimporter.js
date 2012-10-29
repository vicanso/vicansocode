
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var FileImporter, STATIC_PREFIX, VERSION, appPath, config, exportCssHTML, exportJsHTML, fileMerger, fs, getExportFilesHTML, getExportHTML, isFilter, path, _;

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
     * [exportCss 输出CSS标签]
     * @param  {[type]} merge [description]
     * @return {[type]}       [description]
    */


    FileImporter.prototype.exportCss = function(merge) {
      var self;
      self = this;
      return getExportFilesHTML(self.cssFiles, 'css', self.debug, merge);
    };

    /**
     * [exportJs 输出JS标签]
     * @param  {[type]} merge [description]
     * @return {[type]}       [description]
    */


    FileImporter.prototype.exportJs = function(merge) {
      var self;
      self = this;
      return getExportFilesHTML(self.jsFiles, 'js', self.debug, merge);
    };

    return FileImporter;

  })();

  /**
   * [getExportFilesHTML 获取引入文件列表对应的HTML]
   * @param  {[type]} files [引入文件列表]
   * @param  {[type]} type  [引入文件类型，现支持css, js]
   * @param  {[type]} debug [是否debug模式]
   * @param  {[type]} merge [是否需要合并文件]
   * @return {[type]}       [description]
  */


  getExportFilesHTML = function(files, type, debug, merge) {
    var exportAllFilesHTML, exportHTML, exportMergeFilesHTML, linkFileName, mergeFiles;
    exportAllFilesHTML = [];
    exportMergeFilesHTML = [];
    mergeFiles = [];
    _.each(files, function(file) {
      var exportHTML, isMerge, suffix;
      suffix = true;
      isMerge = false;
      if (isFilter(file)) {
        suffix = false;
      } else {
        if (debug && type === 'js') {
          file = file.replace('.min.js', '.js');
        }
        if (!fileMerger.isMergeByOthers(file)) {
          mergeFiles.push(path.join(appPath, STATIC_PREFIX, file));
          isMerge = true;
        }
        file = path.join(STATIC_PREFIX, file);
      }
      exportHTML = getExportHTML(file, type, suffix);
      if (!isMerge) {
        exportMergeFilesHTML.push(exportHTML);
      }
      return exportAllFilesHTML.push(exportHTML);
    });
    if (!merge || debug || mergeFiles.length === 0) {
      return exportAllFilesHTML.join('');
    }
    linkFileName = fileMerger.mergeFilesToTemp(mergeFiles, type);
    if (linkFileName) {
      linkFileName = path.join(config.getTempStaticPrefix(), linkFileName);
      exportHTML = getExportHTML(linkFileName, type, true);
      exportMergeFilesHTML.push(exportHTML);
      return exportMergeFilesHTML.join('');
    } else {
      return exportAllFilesHTML.join('');
    }
  };

  /**
   * [isFilter 判断该文件是否应该过滤的]
   * @param  {[type]}  file [引入文件路径]
   * @return {Boolean}      [description]
  */


  isFilter = function(file) {
    var filterPrefix;
    filterPrefix = 'http';
    if (file.substring(0, filterPrefix.length) === filterPrefix) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * [getExportHTML 返回生成的HTML]
   * @param  {[type]} file   [引入的文件]
   * @param  {[type]} type   [文件类型]
   * @param  {[type]} suffix [是否需要添加后缀（主要是为了增加版本好，用时间作区分）]
   * @return {[type]}        [description]
  */


  getExportHTML = function(file, type, suffix) {
    var html;
    html = '';
    switch (type) {
      case 'js':
        html = exportJsHTML(file, suffix);
        break;
      default:
        html = exportCssHTML(file, suffix);
    }
    return html;
  };

  /**
   * [exportJsHTML 返回引入JS的标签HTML]
   * @param  {[type]} file   [文件名]
   * @param  {[type]} suffix [是否需要文件后缀]
   * @return {[type]}        [description]
  */


  exportJsHTML = function(file, suffix) {
    if (suffix) {
      file += "?version=" + VERSION;
    }
    return '<script type="text/javascript" src="' + file + '"></script>';
  };

  /**
   * [exportCssHTML 返回引入CSS标签的HTML]
   * @param  {[type]} file   [文件名]
   * @param  {[type]} suffix [是否需要文件后缀]
   * @return {[type]}        [description]
  */


  exportCssHTML = function(file, suffix) {
    if (suffix) {
      file += "?version=" + VERSION;
    }
    return '<link rel="stylesheet" href="' + file + '" type="text/css" media="screen" />';
  };

  module.exports = FileImporter;

}).call(this);
