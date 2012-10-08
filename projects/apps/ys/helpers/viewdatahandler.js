(function() {
  var appPath, async, config, logger, mongoClient, viewDataHandler, _;

  _ = require('underscore');

  async = require('async');

  config = require('../../../config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  mongoClient = require("" + appPath + "/apps/ys/models/mongoclient");

  viewDataHandler = {
    home: function(query, options, cbf) {
      var alias, fields;
      fields = {
        title: true
      };
      alias = 'Commodity';
      return async.parallel({
        total: function(cbf) {
          return mongoClient.count(alias, query, cbf);
        },
        data: function(cbf) {
          return mongoClient.find(alias, query, {}, options, cbf);
        }
      }, cbf);
    },
    commodity: function(id, cbf) {
      var alias, query;
      alias = 'Commodity';
      query = {
        _id: id
      };
      return mongoClient.findOne(alias, query, cbf);
    },
    save: function(id, data, cbf) {
      var alias;
      alias = 'Commodity';
      return mongoClient.findByIdAndUpdate(alias, id, data, cbf);
    },
    initScore: function(cbf) {
      var alias;
      alias = 'Commodity';
      return mongoClient.find(alias, {}, function(err, data) {
        return async.forEachLimit(data, 10, function(item, cbf) {
          var id;
          data = {
            score: 1
          };
          if (_.isArray(item.pics) && item.pics.length > 0) {
            data.score = 5;
          }
          id = item._id;
          return viewDataHandler.save(id, data, cbf);
        }, function(err) {
          logger.info('async success');
          return cbf(null);
        });
      });
    }
  };

  module.exports = viewDataHandler;

}).call(this);
