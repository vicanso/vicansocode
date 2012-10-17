(function() {
  var appPath, client, config, dbAlias, init, logger, mongoClient, schemas, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  client = require("" + appPath + "/models/mongoclient");

  logger = require("" + appPath + "/helpers/logger")(__filename);

  schemas = require("" + appPath + "/apps/vicanso/models/schemas");

  dbAlias = 'vicanso';

  init = function(client, dbAlias) {
    var mongoClient, uri;
    mongoClient = {};
    _.each(_.functions(client), function(func) {
      return mongoClient[func] = function() {
        var args;
        if (!_.isFunction(client[func])) {
          return logger.error("call mongoClient function: " + func + " is not defined");
        } else {
          args = _.toArray(arguments);
          args.unshift(dbAlias);
          return client[func].apply(client, args);
        }
      };
    });
    uri = "mongodb://vicanso:86545610@127.0.0.1:10020/vicanso";
    mongoClient.createConnection(uri);
    _.each(schemas, function(model, name) {
      return mongoClient.model(name, model);
    });
    return mongoClient;
  };

  mongoClient = init(client, dbAlias);

  module.exports = mongoClient;

}).call(this);
