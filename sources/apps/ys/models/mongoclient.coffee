_ = require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
client = require "#{appPath}/models/mongoclient"
schemas = require "#{appPath}/apps/ys/models/schemas"
dbAlias = 'ys'


mongoClient = client.getClient dbAlias, "mongodb://vicanso:86545610@127.0.0.1:10020/ys", schemas

module.exports = mongoClient
