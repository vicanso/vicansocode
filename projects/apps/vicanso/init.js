(function() {
  var appConfig, appInfoParse, appName, appPath, config, init, session;

  config = require('../../config');

  appPath = config.getAppPath();

  appConfig = require("" + appPath + "/apps/vicanso/config");

  appInfoParse = require("" + appPath + "/helpers/appinfoparse");

  session = require("" + appPath + "/helpers/session");

  appName = appConfig.getAppName();

  init = function(app) {
    require("" + appPath + "/apps/vicanso/routes")(app);
    appInfoParse.addParser(function(req) {
      if (req.url.indexOf('/vicanso') === 0) {
        return {
          app: appName
        };
      } else {
        return null;
      }
    });
    return session.addHandler(appName, {
      key: 'vicanso',
      secret: 'jenny&tree'
    });
  };

  module.exports = init;

}).call(this);
