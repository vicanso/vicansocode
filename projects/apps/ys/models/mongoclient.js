(function() {
  var appConfig, appPath, client, config, dbAlias, mongoClient, schemas, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  client = require("" + appPath + "/models/mongoclient");

  schemas = require("" + appPath + "/apps/ys/models/schemas");

  appConfig = require("" + appPath + "/apps/ys/config");

  dbAlias = 'ys';

  mongoClient = client.getClient(appConfig.getDataBaseName(), appConfig.getConnectionStr(), schemas);

  module.exports = mongoClient;

}).call(this);
