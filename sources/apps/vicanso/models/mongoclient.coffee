_ = require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
client = require "#{appPath}/models/mongoclient"
schemas = require "#{appPath}/apps/vicanso/models/schemas"
dbAlias = 'vicanso'

# 创建一个新的mongo client，保存有相关的连接信息与schema
mongoClient = client.getClient dbAlias, "mongodb://vicanso:86545610@127.0.0.1:10020/vicanso", schemas

module.exports = mongoClient
