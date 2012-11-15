config = require '../../config'
appPath = config.getAppPath()

appConfig = require "#{appPath}/apps/chaobaida/config"
appInfoParse = require "#{appPath}/helpers/appinfoparse"
session = require "#{appPath}/helpers/session"
appName = appConfig.getAppName()

init = (app) ->
  # 初始化路由配置
  require("#{appPath}/apps/chaobaida/routes") app
  # 添加app信息处理的函数
  appInfoParse.addParser (req) ->
    if req.url.indexOf('/chaobaida') == 0
      return {
        app : appName
      }
    else
      return null
  # 添加seestion的处理函数
  session.addHandler appName, {
    key : 'chaobaida'
  }

module.exports = init