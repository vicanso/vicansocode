
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appPath, config, session, sessionHandler, user;

  config = require('../config');

  appPath = config.getAppPath();

  session = require("" + appPath + "/helpers/session");

  sessionHandler = session.handler();

  user = {
    loader: function() {
      return sessionHandler;
    }
  };

  module.exports = user;

}).call(this);
