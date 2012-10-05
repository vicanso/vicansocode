async = require 'async'
config = require '../../../config'
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
    
module.exports = viewDataHandler
