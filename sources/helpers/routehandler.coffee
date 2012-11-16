_ = require 'underscore'
config = require '../config'
appPath = config.getAppPath()
FileImporter = require "#{appPath}/helpers/fileimporter"
httpHandler = require "#{appPath}/helpers/httphandler"
pageError = require "#{appPath}/helpers/pageerror"
myUtil = require "#{appPath}/helpers/util"

routeHandler = 
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
  convertQueryHandler : () ->
    return (req, res, next) ->
      schema = req.param 'schema'
      conditions = JSON.parse req.param('conditions') || '{}'
      fields = req.param('fields') || ''
      options = JSON.parse req.param('options') || '{}'
      options.limit ?= 30
      req._queryArgs = [
        schema
        conditions
        fields
        options
      ]
      next()
  getAllRoutes : (params, prefix = '') ->
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