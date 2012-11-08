
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appPath, async, config, crypto, fs, logger, mkdirp, noop, path, util, zlib, _;

  _ = require('underscore');

  async = require('async');

  fs = require('fs');

  crypto = require('crypto');

  path = require('path');

  zlib = require('zlib');

  mkdirp = require('mkdirp');

  config = require('../config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  noop = function() {};

  util = {
    /**
     * [mergeFiles 合并文件]
     * @param  {[type]} files       [需要合并的文件列表]
     * @param  {[type]} saveFile    [保存的文件]
     * @param  {[type]} dataConvert [可选参数，需要对数据做的转化，如果不需要转换，该参数作为完成时的call back]
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
          logger.error(err);
          return cbf(err);
        } else {
          return mkdirp(path.dirname(saveFile), function(err) {
            if (err) {
              logger.error(err);
              return cbf(err);
            } else {
              return fs.writeFile(saveFile, results.join(''), cbf);
            }
          });
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
    },
    /**
     * [gzip gzip压缩数据]
     * @param  {[type]} data [description]
     * @param  {[type]} cbf  [description]
     * @return {[type]}      [description]
    */

    gzip: function(data, cbf) {
      return zlib.gzip(data, cbf);
    },
    /**
     * [deflate 以deflate的方式压缩数据]
     * @param  {[type]} data [description]
     * @param  {[type]} cbf  [description]
     * @return {[type]}      [description]
    */

    deflate: function(data, cbf) {
      return zlib.deflate(data, cbf);
    },
    /**
     * [cutStringByViewSize 根据显示的尺寸截剪字符串]
     * @param  {[type]} str      [字符串]
     * @param  {[type]} viewSize [显示的长度（中文字符为2，英文字符为1）]
     * @return {[type]}          [description]
    */

    cutStringByViewSize: function(str, viewSize) {
      var charCode, currentViewSize, index, strLength;
      strLength = str.length;
      viewSize *= 2;
      currentViewSize = 0;
      index = 0;
      while (index !== strLength) {
        charCode = str.charCodeAt(index);
        if (charCode < 0xff) {
          currentViewSize++;
        } else {
          currentViewSize += 2;
        }
        index++;
        if (currentViewSize > viewSize) {
          break;
        }
      }
      if (index === strLength) {
        return str;
      } else {
        return str.substring(0, index) + '...';
      }
    },
    /**
     * [resIsAvailable 判断response是否可用]
     * @param  {[type]} res [response对象]
     * @return {[type]}     [description]
    */

    resIsAvailable: function(res) {
      if (res._headerSent) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * [response 响应http请求]
     * @param  {[type]} res         [response对象]
     * @param  {[type]} data        [响应的数据]
     * @param  {[type]} maxAge      [该请求头的maxAge]
     * @param  {[type]} contentType [返回的contentType(默认为text/html)]
     * @return {[type]}             [description]
    */

    response: function(res, data, maxAge, contentType) {
      if (contentType == null) {
        contentType = 'text/html';
      }
      if (!this.resIsAvailable(res)) {
        return;
      }
      switch (contentType) {
        case 'application/javascript':
          res.header('Content-Type', 'application/javascript; charset=UTF-8');
          break;
        case 'text/html':
          res.header('Content-Type', 'text/html; charset=UTF-8');
      }
      if (maxAge === 0) {
        res.header('Cache-Control', 'no-cache, no-store, max-age=0');
      } else {
        res.header('Cache-Control', "public, max-age=" + maxAge);
      }
      res.header('Last-Modified', new Date());
      return res.send(data);
    },
    randomKey: function(length, legalChars) {
      var getRandomChar, legalCharList, num;
      if (length == null) {
        length = 10;
      }
      if (legalChars == null) {
        legalChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      }
      legalCharList = legalChars.split('');
      getRandomChar = function(legalCharList) {
        var legalCharListLength;
        legalCharListLength = legalCharList.length;
        return legalCharList[Math.floor(Math.random() * legalCharListLength)];
      };
      return ((function() {
        var _i, _results;
        _results = [];
        for (num = _i = 0; 0 <= length ? _i < length : _i > length; num = 0 <= length ? ++_i : --_i) {
          _results.push(getRandomChar(legalCharList));
        }
        return _results;
      })()).join('');
    }
  };

  module.exports = util;

}).call(this);
