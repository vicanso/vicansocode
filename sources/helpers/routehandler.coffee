_ = require 'underscore'
config = require '../config'
appPath = config.getAppPath()
FileImporter = require "#{appPath}/helpers/fileimporter"
httpHandler = require "#{appPath}/helpers/httphandler"
pageError = require "#{appPath}/helpers/pageerror"

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

module.exports[key] = func for key, func of routeHandler