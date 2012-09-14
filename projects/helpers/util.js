(function() {
  var async, crypto, fs, logger, util, _;

  _ = require('underscore');

  async = require('async');

  fs = require('fs');

  crypto = require('crypto');

  logger = require('log4js').getLogger();

  util = {
    mergeFiles: function(files, saveFile) {
      var funcs;
      funcs = [];
      _.each(files, function(file) {
        return funcs.push(function(cbf) {
          return fs.readFile(file, 'utf8', function(err, data) {
            return cbf(err, data);
          });
        });
      });
      return async.parallel(funcs, function(err, results) {
        if (err) {
          return logger.error(err);
        } else {
          return fs.writeFile(saveFile, results.join(''));
        }
      });
    },
    md5: function(data, digestType) {
      return this.crypto(data, 'md5', digestType);
    },
    sha1: function(data, digestType) {
      return this.crypto(data, 'sha1', digestType);
    },
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
