
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var config, express, isProductionMode, pageError;

  express = require('express');

  config = require('../config');

  isProductionMode = config.isProductionMode();

  pageError = {
    /**
     * [handler 返回错误信息处理函数]
     * @return {[type]} [description]
    */

    handler: function() {
      if (isProductionMode) {
        return function(err, req, res) {};
      } else {
        return express.errorHandler({
          dumpExceptions: true,
          showStack: true
        });
      }
    },
    /**
     * [error 返回错误对象]
     * @param  {[type]} status [http状态码]
     * @param  {[type]} msg    [出错信息]
     * @return {[type]}        [description]
    */

    error: function(status, msg) {
      var err;
      err = new Error(msg);
      err.status = status;
      return err;
    }
  };

  module.exports = pageError;

}).call(this);
