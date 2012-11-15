config = require '../../../config'
appPath = config.getAppPath()
async = require 'async'
request = require 'request'
_ =require 'underscore'
mongoClient = require "#{appPath}/apps/chaobaida/models/mongoclient"
logger = require("#{appPath}/helpers/logger") __filename

viewDataHandler = 
  items : (cbf) ->
    mongoClient.find 'Goods', {}, 'clickUrl data itemId itemPrice marketPrice picUrl title', {limit : 30}, cbf

module.exports[key] = func for key, func of viewDataHandler