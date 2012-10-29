_ = require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
client = require "#{appPath}/models/mongoclient"
schemas = require "#{appPath}/apps/ys/models/schemas"
appConfig = require "#{appPath}/apps/ys/config"
dbAlias = 'ys'


# 创建一个新的mongo client，保存有相关的连接信息与schema
mongoClient = client.getClient appConfig.getDataBaseName(), appConfig.getConnectionStr(), schemas

module.exports = mongoClient
