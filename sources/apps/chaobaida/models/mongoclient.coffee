_ = require 'underscore'
config = require "#{process._appPath}/config"
appPath = config.getAppPath()
client = require "#{appPath}/models/mongoclient"
appConfig = require "#{appPath}/apps/chaobaida/config"

# 创建一个新的mongo client，保存有相关的连接信息与schema
mongoClient = client.getClient appConfig.getDataBaseName(), appConfig.getConnectionStr(), "#{appPath}/apps/chaobaida/models/schemas"

module.exports[key] = func for key, func of mongoClient