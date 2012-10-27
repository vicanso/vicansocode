_ = require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
viewContentHandler = require "#{appPath}/apps/vicanso/helpers/viewcontenthandler"
FileImporter = require "#{appPath}/helpers/fileimporter"
httpHandler = require "#{appPath}/helpers/httphandler"
mongoClient = require "#{appPath}/apps/vicanso/models/mongoclient"
errorPageHandler = require "#{appPath}/apps/vicanso/helpers/errorpagehandler"
session = require "#{appPath}/helpers/session"
sessionHandler = session.handler()
# 路由信息表
routeInfos = [
  {
    type : 'get'
    route : '/vicanso'
    jadeView : 'vicanso/index'
    handerFunc : 'index'
  }
  {
    type : 'get'
    route : '/vicanso/article/:id'
    jadeView : 'vicanso/article'
    handerFunc : 'article'
  }
  {
    type : 'all'
    route : '/vicanso/admin/addarticle'
    jadeView : 'vicanso/admin/addarticle'
    handerFunc : 'addArticle'
  }
  {
    type : 'all'
    route : '/vicanso/admin/login'
    jadeView : 'vicanso/admin/login'
    handerFunc : 'login'
  }
]

module.exports = (app) ->
  _.each routeInfos, (routeInfo) ->
    app[routeInfo.type] routeInfo.route, (req, res) ->
      debug = !config.isProductionMode()
      viewContentHandler[routeInfo.handerFunc] req, res, (viewData) ->
        if viewData
          viewData.fileImporter = new FileImporter debug
          httpHandler.render req, res, routeInfo.jadeView, viewData
        else
          errorPageHandler.response 500
          
  app.get '/vicanso/ajax/*', (req, res) ->
    res.send 'success'

  app.get '/vicanso/nocacheinfo.js', sessionHandler, (req, res) ->
    res.header 'Content-Type', 'application/javascript; charset=UTF-8'
    res.header 'Cache-Control', 'no-cache, no-store, max-age=0'
    res.send "var USER_INFO = {};"

  app.get '/vicanso/updatenodemodules', (req, res) ->
    viewContentHandler.updateNodeModules res
    



