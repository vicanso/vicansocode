config = require '../../config'
appPath = config.getAppPath()

appConfig = require "#{appPath}/apps/vicanso/config"
appInfoParse = require "#{appPath}/helpers/appinfoparse"
session = require "#{appPath}/helpers/session"
appName = appConfig.getAppName()

init = (app) ->
  # 初始化路由配置
  require("#{appPath}/apps/vicanso/routes") app
  # 添加app信息处理的方法
  appInfoParse.addParser (req) ->
    if req.url.indexOf('/vicanso') == 0
      return {
        app : appName
      }
    else
      return null

  session.addHandler appName, {
    key : 'vicanso'
    secret : 'jenny&tree'
  }

module.exports = init