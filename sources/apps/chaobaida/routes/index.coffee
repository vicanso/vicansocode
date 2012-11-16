_ = require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
viewContentHandler = require "#{appPath}/apps/chaobaida/helpers/viewcontenthandler"
routeHandler = require "#{appPath}/helpers/routehandler"
myUtil = require "#{appPath}/helpers/util"
user = require "#{appPath}/helpers/user"
pageError = require "#{appPath}/helpers/pageerror"
userLoader = user.loader()
convertQueryHandler = routeHandler.convertQueryHandler()
mongoClient = require "#{appPath}/apps/chaobaida/models/mongoclient"
logger = require("#{appPath}/helpers/logger") __filename

routeInfos = [
  {
    type : 'get'
    route : '/qz/shb/items'
    jadeView : 'chaobaida/items'
    handerFunc : 'items'
  }
]

# convertQuery = (params) ->
#   logger.warn convertSpecialChar params.conditions
#   queryArgs = [
#     params.schema
#     JSON.parse convertSpecialChar params.conditions
#     ''
#     JSON.parse convertSpecialChar params.limit
#   ]
#   return queryArgs


module.exports = (app) ->
  params = [
    'conditions'
    'fields'
    'options'
  ]
  routes = routeHandler.getAllRoutes params, '/qz/schema/:schema'
  _.each routes, (route) ->
    app.get route, queryHandler


queryHandler = [
  convertQueryHandler
  (req, res, next) ->
    args = req._queryArgs
    logger.warn args
    args.push (err, docs) ->
      res.json docs
    mongoClient.find.apply mongoClient, args
]

