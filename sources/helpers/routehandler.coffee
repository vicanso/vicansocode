_ = require 'underscore'
config = require '../config'
appPath = config.getAppPath()
FileImporter = require "#{appPath}/helpers/fileimporter"
httpHandler = require "#{appPath}/helpers/httphandler"
pageError = require "#{appPath}/helpers/pageerror"
myUtil = require "#{appPath}/helpers/util"

routeHandler = 
  ###*
   * initRoutes 初始化路由处理
   * @param  {[type]} app                [description]
   * @param  {[type]} routeInfos         [description]
   * @param  {[type]} viewContentHandler [description]
   * @return {[type]}                    [description]
  ###
  initRoutes : (app, routeInfos, viewContentHandler) ->
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
              httpHandler.json req, res, viewData
          else
            err = pageError.error 500, "#{__filename}: the viewData is null"
            next err
  ###*
   * convertQueryHandler 转换查询函数的处理器
   * @return {[type]} [description]
  ###
  convertQueryHandler : () ->
    return (req, res, next) ->
      schema = req.param 'schema'
      conditions = req.param('conditions') || '{}'
      if _.isString conditions
        conditions = JSON.parse conditions
      fields = req.param('fields') || ''
      options = req.param('options') || '{}'
      if _.isString options
        options = JSON.parse options
      options.limit ?= 30
      req._queryArgs = [
        schema
        conditions
        fields
        options
      ]
      next()
  ###*
   * getAllRoutes 根据参数列表生成所有的路由
   * @param  {[type]} prefix = '' [description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
  ###
  getAllRoutes : (prefix = '', params = ['conditions', 'fields', 'options']) ->
    paramsLength = params.length
    routes = []
    routeParamsList = myUtil.permutation params
    for i in [2...paramsLength]
      subParams = myUtil.combination params, i
      _.each subParams, (subParam) ->
        routeParamsList = routeParamsList.concat myUtil.permutation subParam
    _.each routeParamsList, (routeParams) ->
      route = prefix
      _.each routeParams, (routeParam) ->
        route += "/#{routeParam}/:#{routeParam}"
        routes.push route
    return routes
module.exports[key] = func for key, func of routeHandler