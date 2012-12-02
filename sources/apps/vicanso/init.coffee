config = require "#{process._appPath}/config"
appPath = config.getAppPath()

appConfig = require "#{appPath}/apps/vicanso/config"
appInfoParse = require "#{appPath}/helpers/appinfoparse"
session = require "#{appPath}/helpers/session"
appName = appConfig.getAppName()
redisClient = require "#{appPath}/models/redisclient"

webtendMiddleware = require('webtend').middleware

init = (app) ->
  # 初始化路由配置
  require("#{appPath}/apps/vicanso/routes") app
  # 添加app信息处理的函数
  webtendMiddleware.addInfoParser (req) ->
    if req.url.indexOf('/vicanso') == 0
      return {
        appName : appName
      }
    else
      return null
  # 添加seestion的处理函数
  webtendMiddleware.addSessionParser appName, {
    client : redisClient
    # ttl的单位为S
    ttl : 30 * 60
  }

module.exports = init