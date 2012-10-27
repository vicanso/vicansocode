(function() {
  var appConfig, appInfoParse, appName, appPath, config, init, session;

  config = require('../../config');

  appPath = config.getAppPath();

  appConfig = require("" + appPath + "/apps/ys/config");

  appInfoParse = require("" + appPath + "/helpers/appinfoparse");

  session = require("" + appPath + "/helpers/session");

  appName = appConfig.getAppName();

  init = function(app) {
    require("" + appPath + "/apps/ys/routes")(app);
    appInfoParse.addParser(function(req) {
      if (req.url.indexOf('/ys') === 0) {
        return {
          app: appName
        };
      } else {
        return null;
      }
    });
    return session.addHandler(appName, {
      key: 'ys',
      secret: 'jenny&tree'
    });
  };

  module.exports = init;

}).call(this);
