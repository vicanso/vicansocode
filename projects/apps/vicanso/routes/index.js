(function() {
  var FileImporter, appPath, config, httpHandler, viewContentHandler;

  config = require('../../../config');

  appPath = config.getAppPath();

  viewContentHandler = require("" + appPath + "/apps/vicanso/helpers/viewcontenthandler");

  FileImporter = require("" + appPath + "/helpers/fileimporter");

  httpHandler = require("" + appPath + "/helpers/httphandler");

  module.exports = function(app) {
    return app.get('/', function(req, res) {
      var debug, fileImporter, jadeView, viewData;
      jadeView = 'vicanso/index';
      debug = !config.isProductionMode();
      fileImporter = new FileImporter(debug);
      viewData = viewContentHandler.index(fileImporter);
      return httpHandler.render(req, res, jadeView, viewData);
    });
  };

}).call(this);
