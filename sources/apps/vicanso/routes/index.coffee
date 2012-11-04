_ = require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
viewContentHandler = require "#{appPath}/apps/vicanso/helpers/viewcontenthandler"
FileImporter = require "#{appPath}/helpers/fileimporter"
httpHandler = require "#{appPath}/helpers/httphandler"
mongoClient = require "#{appPath}/apps/vicanso/models/mongoclient"
# errorPageHandler = require "#{appPath}/apps/vicanso/helpers/errorpagehandler"
myUtil = require "#{appPath}/helpers/util"
user = require "#{appPath}/helpers/user"
pageError = require "#{appPath}/helpers/pageerror"
userLoader = user.loader()
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
    middleware : [userLoader]
    jadeView : 'vicanso/article'
    handerFunc : 'article'
  }
  {
    type : 'get'
    route : '/vicanso/admin/addarticle'
    jadeView : 'vicanso/admin/addarticle'
    handerFunc : 'addArticle'
  }
  {
    type : 'post'
    route : '/vicanso/ajax/admin/addarticle'
    handerFunc : 'addArticle'
  }
  {
    type : 'get'
    route : '/vicanso/admin/login'
    jadeView : 'vicanso/admin/login'
    handerFunc : 'login'
  }
  {
    type : 'post'
    route : '/vicanso/ajax/admin/login'
    middleware : [userLoader]
    handerFunc : 'login'
  }
  {
    type : 'get'
    route : '/vicanso/ajax/userbehavior/:behavior/:targetId'
    middleware : [userLoader]
    handerFunc : 'userBehavior'
  }
]

module.exports = (app) ->
  _.each routeInfos, (routeInfo) ->
    middleware = routeInfo.middleware || []
    app[routeInfo.type] routeInfo.route, middleware, (req, res, next) ->
      debug = !config.isProductionMode()
      viewContentHandler[routeInfo.handerFunc] req, res, (viewData) ->
        if viewData
          if routeInfo.jadeView
            viewData.fileImporter = new FileImporter debug
            httpHandler.render req, res, routeInfo.jadeView, viewData
          else
            if _.isObject viewData
              viewData = JSON.stringify viewData
            res.send viewData
        else
          err = pageError.error 500, "#{__filename}: the viewData is null"
          next err
          # errorPageHandler.response 500
          
  # app.get '/vicanso/ajax/*', (req, res) ->
  #   res.send 'success'

  app.get '/vicanso/nocacheinfo.js', userLoader, (req, res) ->
    viewContentHandler.getNoCacheInfo req, res, (viewData) ->
      myUtil.response res, viewData, 0, 'application/javascript'

  app.get '/vicanso/updatenodemodules', (req, res) ->
    viewContentHandler.updateNodeModules res



