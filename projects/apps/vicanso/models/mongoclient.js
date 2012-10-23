(function() {
  var appPath, client, config, dbAlias, mongoClient, schemas, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  client = require("" + appPath + "/models/mongoclient");

  schemas = require("" + appPath + "/apps/vicanso/models/schemas");

  dbAlias = 'vicanso';

  mongoClient = client.getClient(dbAlias, "mongodb://vicanso:86545610@127.0.0.1:10020/vicanso", schemas);

  module.exports = mongoClient;

}).call(this);
