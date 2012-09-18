(function() {
  var appPath, config, express, staticHandler;

  express = require('express');

  config = require('../config');

  appPath = config.getAppPath();

  staticHandler = {
    /**
     * [static 静态文件HTTP请求处理]
     * @return {[type]} [description]
    */

    "static": function() {
      var staticCompressHandler, staticPath, staticPrefix, staticPrefixLength;
      staticPath = config.getStaticPath();
      staticPrefix = config.getStaticPrefix();
      staticPrefixLength = staticPrefix.length;
      staticCompressHandler = express.compress({
        memLevel: 9
      });
      staticHandler = express["static"]("" + staticPath, {
        maxAge: 60 * 60 * 1000,
        redirect: false
      });
      return function(req, res, next) {
        if (req.url.substring(0, staticPrefixLength) === staticPrefix) {
          req.url = req.url.substring(staticPrefixLength);
          staticCompressHandler(req, res, function() {});
          return staticHandler(req, res, next);
        } else {
          return next();
        }
      };
    }
  };

  module.exports = staticHandler;

}).call(this);
