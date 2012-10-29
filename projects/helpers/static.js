
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appPath, config, express, staticHandler;

  express = require('express');

  config = require('../config');

  appPath = config.getAppPath();

  staticHandler = {
    /**
     * [handler 静态文件HTTP请求处理]
     * @return {[type]} [description]
    */

    handler: function() {
      var handler, staticCompressHandler, staticPath, staticPrefix, staticPrefixLength;
      staticPath = config.getStaticPath();
      staticPrefix = config.getStaticPrefix();
      staticPrefixLength = staticPrefix.length;
      staticCompressHandler = express.compress({
        memLevel: 9
      });
      handler = express["static"]("" + staticPath, {
        maxAge: config.getStaticFileMaxAge() * 1000,
        redirect: false
      });
      return function(req, res, next) {
        if (req.url.substring(0, staticPrefixLength) === staticPrefix) {
          req.url = req.url.substring(staticPrefixLength);
          return staticCompressHandler(req, res, function() {
            return handler(req, res, next);
          });
        } else {
          return next();
        }
      };
    }
  };

  module.exports = staticHandler;

}).call(this);
