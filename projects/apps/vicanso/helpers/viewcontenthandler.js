(function() {
  var appPath, baseConfig, config, viewContentHandler, webConfig;

  config = require('../../../config');

  appPath = config.getAppPath();

  webConfig = require("" + appPath + "/apps/vicanso/helpers/webconfig");

  baseConfig = require("" + appPath + "/helpers/baseconfig");

  viewContentHandler = {
    index: function(fileImporter) {
      var viewData;
      viewData = {
        title: '每天再往前一点！',
        fileImporter: fileImporter,
        viewContent: {
          header: webConfig.getHeader(0)
        },
        baseConfig: {
          baseDialog: baseConfig.getDialogConfig()
        }
      };
      return viewData;
    }
  };

  module.exports = viewContentHandler;

}).call(this);
