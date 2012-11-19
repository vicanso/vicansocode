_ =require 'underscore'
async = require 'async'
config = require "#{process._appPath}/config"
appPath = config.getAppPath()
logger = require("#{appPath}/helpers/logger") __filename
mongoClient = require "#{appPath}/apps/ys/models/mongoclient"


viewDataHandler = 
  home : (query, options, cbf) ->
    fields =
      title : true
    alias = 'Commodity'
    async.parallel {
      total : (cbf) ->
        mongoClient.count alias, query, cbf
      data : (cbf) ->
        mongoClient.find alias, query, {}, options, cbf
    },
    cbf
  
  commodity : (id, cbf) ->
    alias = 'Commodity'
    query = 
      _id : id
    mongoClient.findOne alias, query, cbf

  save : (id, data, cbf) ->
    alias = 'Commodity'
    mongoClient.findByIdAndUpdate alias, id, data, cbf

  initScore : (cbf) ->
    alias = 'Commodity'
    mongoClient.find alias, {}, (err, data) ->
      async.forEachLimit data, 10, (item, cbf) ->
        data = 
          score : 1
        if _.isArray(item.pics) && item.pics.length > 0 
          data.score = 5
        id = item._id
        viewDataHandler.save id, data, cbf
      ,(err) ->
        logger.info 'async success'
        cbf null
module.exports = viewDataHandler
