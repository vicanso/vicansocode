(function() {
  var appPath, async, config, crypto, fs, logger, noop, path, util, _;

  _ = require('underscore');

  async = require('async');

  fs = require('fs');

  crypto = require('crypto');

  path = require('path');

  _ = require('underscore');

  config = require('../config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  noop = function() {};

  util = {
    /**
     * [mergeFiles 合并文件]
     * @param  {[type]} files       [需要合并的文件列表]
     * @param  {[type]} saveFile    [保存的文件]
     * @param  {[type]} dataConvert [需要对数据作的转化，如果不需要转换，该参数作为完成时的call back]
     * @param  {[type]} cbf         [完成时的call back]
     * @return {[type]}             [description]
    */

    mergeFiles: function(files, saveFile, dataConvert, cbf) {
      var funcs;
      funcs = [];
      if (arguments.length === 3) {
        cbf = dataConvert;
        dataConvert = null;
      }
      cbf = cbf || noop;
      _.each(files, function(file) {
        return funcs.push(function(cbf) {
          return fs.readFile(file, 'utf8', function(err, data) {
            if (!err && dataConvert) {
              data = dataConvert(data, file, saveFile);
            }
            return cbf(err, data);
          });
        });
      });
      return async.parallel(funcs, function(err, results) {
        if (err) {
          return logger.error(err);
        } else {
          return fs.writeFile(saveFile, results.join(''), cbf);
        }
      });
    },
    /**
     * [md5 md5加密]
     * @param  {[type]} data       [加密的数据]
     * @param  {[type]} digestType [加密数据返回格式，若不传该参数则以hex的形式返回]
     * @return {[type]}            [description]
    */

    md5: function(data, digestType) {
      return this.crypto(data, 'md5', digestType);
    },
    /**
     * [sha1 sha1加密，参数和md5加密一致]
     * @param  {[type]} data       [加密的数据]
     * @param  {[type]} digestType [加密数据返回格式，若不传该参数则以hex的形式返回]
     * @return {[type]}            [description]
    */

    sha1: function(data, digestType) {
      return this.crypto(data, 'sha1', digestType);
    },
    /**
     * [crypto 加密]
     * @param  {[type]} data       [加密数据]
     * @param  {[type]} type       [加密类型，可选为:md5, sha1等]
     * @param  {[type]} digestType [加密数据的返回类型，若不传该参数则以hex的形式返回]
     * @return {[type]}            [description]
    */

    crypto: function(data, type, digestType) {
      var cryptoData;
      if (digestType == null) {
        digestType = 'hex';
      }
      cryptoData = crypto.createHash(type).update(data).digest(digestType);
      return cryptoData;
    }
  };

  module.exports = util;

}).call(this);
