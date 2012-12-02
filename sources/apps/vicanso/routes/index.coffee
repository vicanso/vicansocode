_ = require 'underscore'
config = require "#{process._appPath}/config"
appPath = config.getAppPath()
viewContentHandler = require "#{appPath}/apps/vicanso/helpers/viewcontenthandler"
mongoClient = require "#{appPath}/apps/vicanso/models/mongoclient"
myUtil = require "#{appPath}/helpers/util"
routeHandler = require('webtend').middleware.routeHandler()
user = require "#{appPath}/helpers/user"
userLoader = user.loader()
# 路由信息表
routeInfos = [
  {
    type : 'get'
    route : '/vicanso'
    middleware : [userLoader]
    jadeView : 'vicanso/index'
    handerFunc : viewContentHandler.index
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
  routeHandler.initRoutes app, routeInfos, 
          
  # app.get '/vicanso/ajax/*', (req, res) ->
  #   res.send 'success'

  app.get '/vicanso/nocacheinfo.js', userLoader, (req, res) ->
    viewContentHandler.getNoCacheInfo req, res, (viewData) ->
      myUtil.response res, viewData, 0, 'application/javascript'

  app.get '/vicanso/updatenodemodules', (req, res) ->
    viewContentHandler.updateNodeModules res



