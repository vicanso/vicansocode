config = require '../config'
appPath = config.getAppPath()
express = require 'express'
_ = require 'underscore'
RedisStore = require('connect-redis') express
redisClient = require "#{appPath}/models/redisclient"
appInfoParse = require "#{appPath}/helpers/appinfoparse"

defaultOptions =
  key : 'vicanso'
  secret : 'jenny&tree'
redisOptions = 
  client : redisClient
  # ttl的单位为S
  ttl : 30 * 60
sessionHandleFunctions = {}
cookieParser = express.cookieParser()
session = 
  ###*
   * [handler session的处理函数]
   * @return {[type]} [description]
  ###
  handler : () ->
    return (req, res, next) ->
      cookieParser req, res, () ->
        appName = appInfoParse.getAppName req
        console.log req.url
        session.getHandler(appName) req, res, next
  ###*
   * [addHandler 添加session的处理函数]
   * @param {[type]} appName [app的名字（不同的app可以有不同的处理函数，则不加，则可使用默认的处理方法）]
   * @param {[type]} options [session的存储配置（key, secret）]
  ###
  addHandler : (appName, options) ->
    if appName
      options = _.extend {}, defaultOptions, options
      options.store = new RedisStore redisOptions
      sessionHandleFunctions[appName] = express.session options
  ###*
   * [getHandler 根据app获得处理函数]
   * @param  {[type]} appName [app的名字，若不添加，则默认为'all']
   * @return {[type]}         [description]
  ###
  getHandler : (appName = 'all') ->
    return sessionHandleFunctions[appName]


session.addHandler 'all'

module.exports = session