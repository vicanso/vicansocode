(function() {
  var config, express, isProductionMode, pageError;

  express = require('express');

  config = require('../config');

  isProductionMode = config.isProductionMode();

  pageError = {
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
    error: function(status, msg) {
      var err;
      err = new Error(msg);
      err.status = status;
      return err;
    }
  };

  module.exports = pageError;

}).call(this);
