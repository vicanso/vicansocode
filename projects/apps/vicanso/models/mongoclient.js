(function() {
  var appConfig, appPath, client, config, mongoClient, schemas, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  client = require("" + appPath + "/models/mongoclient");

  schemas = require("" + appPath + "/apps/vicanso/models/schemas");

  appConfig = require("" + appPath + "/apps/vicanso/config");

  mongoClient = client.getClient(appConfig.getDataBaseName(), appConfig.getConnectionStr(), schemas);

  module.exports = mongoClient;

}).call(this);
