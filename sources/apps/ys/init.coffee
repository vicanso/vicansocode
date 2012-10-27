config = require '../../config'
appPath = config.getAppPath()

appConfig = require "#{appPath}/apps/ys/config"
appInfoParse = require "#{appPath}/helpers/appinfoparse"
session = require "#{appPath}/helpers/session"
appName = appConfig.getAppName()

init = (app) ->
  require("#{appPath}/apps/ys/routes") app
  # 添加app信息处理的函数
  appInfoParse.addParser (req) ->
    if req.url.indexOf('/ys') == 0
      return {
        app : appName
      }
    else
      return null
  # 添加seestion的处理函数
  session.addHandler appName, {
    key : 'ys'
    secret : 'jenny&tree'
  }

module.exports = init