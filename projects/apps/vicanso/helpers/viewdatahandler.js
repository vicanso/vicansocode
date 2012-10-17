(function() {
  var appPath, async, config, downloadNodeModulesPackage, logger, mongoClient, request, viewDataHandler, _;

  config = require('../../../config');

  appPath = config.getAppPath();

  async = require('async');

  request = require('request');

  _ = require('underscore');

  mongoClient = require("" + appPath + "/apps/vicanso/models/mongoclient");

  logger = require("" + appPath + "/helpers/logger")(__filename);

  viewDataHandler = {
    index: function(cbf) {
      return async.parallel({
        reflection: function(cbf) {
          return mongoClient.findOne('Reflection', {}, 'title createTime content', cbf);
        },
        articles: function(cbf) {
          return mongoClient.find('Article', {}, 'title createTime content', {
            limit: 5
          }, cbf);
        },
        recommendArticles: function(cbf) {
          return mongoClient.find('RecommendArticle', {}, 'title createTime content source', {
            limit: 5
          }, cbf);
        }
      }, cbf);
    },
    article: function(id, cbf) {
      return mongoClient.findById('Article', id, 'title createTime content', cbf);
    },
    updateNodeModules: function(cbf) {
      return downloadNodeModulesPackage(cbf);
    }
  };

  downloadNodeModulesPackage = function(cbf) {
    var repositories;
    repositories = ['https://github.com/caolan/async', 'https://github.com/jashkenas/coffee-script', 'https://github.com/visionmedia/commander.js', 'https://github.com/visionmedia/connect-redis', 'https://github.com/visionmedia/express', 'https://github.com/ashtuchkin/iconv-lite', 'https://github.com/visionmedia/jade', 'https://github.com/cloudhead/less.js', 'https://github.com/nomiddlename/log4js-node', 'https://github.com/substack/node-mkdirp', 'https://github.com/mongodb/node-mongodb-native', 'https://github.com/LearnBoost/mongoose', 'https://github.com/Vizzuality/node-varnish', 'https://github.com/mranney/node_redis', 'https://github.com/mikeal/request', 'https://github.com/mishoo/UglifyJS', 'https://github.com/documentcloud/underscore'];
    return async.forEachLimit(repositories, 10, function(repository, cbf) {
      var url;
      repository = repository.replace('github.com', 'raw.github.com');
      url = "" + repository + "/master/package.json";
      return request(url, function(err, res, data) {
        var _ref;
        if (!err && res.statusCode === 200) {
          data = JSON.parse(data);
          if (!_.isString(data.repository)) {
            data.repository = (_ref = data.repository) != null ? _ref.url : void 0;
          }
          data = _.pick(data, 'name', 'description', 'homepage', 'keywords', 'author', 'repository', 'main', 'version');
          mongoClient.save('NodeModule', data, function() {
            return logger.info('save complete');
          });
        } else {
          logger.error(url);
          logger.error(err);
        }
        return cbf();
      });
    }, cbf);
  };

  module.exports = viewDataHandler;

}).call(this);