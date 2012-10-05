_ = require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
client = require "#{appPath}/models/mongoclient"
logger = require("#{appPath}/helpers/logger") __filename
schemas = require "#{appPath}/apps/ys/models/schemas"
dbAlias = 'ys'

init = (client, dbAlias) ->
  mongoClient = {}
  _.each _.functions(client), (func) ->
    mongoClient[func] = () ->
      if !_.isFunction client[func]
        logger.error "call mongoClient function: #{func} is not defined"
      else
        args = _.toArray arguments
        args.unshift dbAlias  
        client[func].apply client, args
  uri = "mongodb://vicanso:86545610@127.0.0.1:10020/ys"
  mongoClient.createConnection uri
  _.each schemas, (model, name) ->
    mongoClient.model name, model
  return mongoClient

mongoClient = init client, dbAlias

module.exports = mongoClient
