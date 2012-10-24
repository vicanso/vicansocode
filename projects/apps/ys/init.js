(function() {
  var appPath, config, init;

  config = require('../../config');

  appPath = config.getAppPath();

  init = function(app) {
    return require("" + appPath + "/apps/ys/routes")(app);
  };

  module.exports = init;

}).call(this);
