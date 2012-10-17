config = require '../../../config'
appPath = config.getAppPath()
async = require 'async'
request = require 'request'
_ =require 'underscore'
mongoClient = require "#{appPath}/apps/vicanso/models/mongoclient"
logger = require("#{appPath}/helpers/logger") __filename


viewDataHandler = 
  index : (cbf) ->
    async.parallel {
      reflection : (cbf) ->
        mongoClient.findOne 'Reflection', {}, 'title createTime content', cbf
      articles : (cbf) ->
        mongoClient.find 'Article', {}, 'title createTime content', {
          limit : 5  
        }, cbf
      recommendArticles : (cbf) ->
        mongoClient.find 'RecommendArticle', {}, 'title createTime content source', {
          limit : 5
        }, cbf
    }, cbf
  article : (id, cbf) ->
    mongoClient.findById 'Article', id, 'title createTime content', cbf
  updateNodeModules : (cbf) ->
    downloadNodeModulesPackage cbf


downloadNodeModulesPackage = (cbf) ->
  repositories = [
    'https://github.com/caolan/async'
    'https://github.com/jashkenas/coffee-script'
    'https://github.com/visionmedia/commander.js'
    'https://github.com/visionmedia/connect-redis'
    'https://github.com/visionmedia/express'
    'https://github.com/ashtuchkin/iconv-lite'
    'https://github.com/visionmedia/jade'
    'https://github.com/cloudhead/less.js'
    'https://github.com/nomiddlename/log4js-node'
    'https://github.com/substack/node-mkdirp'
    'https://github.com/mongodb/node-mongodb-native'
    'https://github.com/LearnBoost/mongoose'
    'https://github.com/Vizzuality/node-varnish'
    'https://github.com/mranney/node_redis'
    'https://github.com/mikeal/request'
    'https://github.com/mishoo/UglifyJS'
    'https://github.com/documentcloud/underscore'
  ]
  async.forEachLimit repositories, 10, (repository, cbf) ->
    repository = repository.replace 'github.com', 'raw.github.com'
    url = "#{repository}/master/package.json"
    request url, (err, res, data) ->
      if !err && res.statusCode == 200
        data = JSON.parse data
        if !_.isString data.repository
          data.repository = data.repository?.url
        data = _.pick data, 'name', 'description', 'homepage', 'keywords', 'author', 'repository', 'main', 'version'
        mongoClient.save 'NodeModule', data, () ->
          logger.info 'save complete'
      else
        logger.error url
        logger.error err
      cbf()
  ,cbf




module.exports = viewDataHandler