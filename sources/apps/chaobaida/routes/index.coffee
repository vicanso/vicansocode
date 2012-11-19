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

# ROUTE TEST
# http://localhost:10000/qz/schema/Goods/conditions/{"categories.cid":1001}
# http://localhost:10000/qz/schema/Goods/options/{"limit":10}/conditions/{"categories.cid":1001}
# http://localhost:10000/qz/schema/Goods/options/{"limit":10}
# http://localhost:10000/qz/schema/Goods/options/{"limit":10}/fields/"brand clickUrl createTime"
# 
# coffee app.coffee -n 1000 -c 50 -l http://localhost:10000/qz/schema/Goods/conditions/%7B%22categories.cid%22:1001%7D,http://localhost:10000/qz/schema/Goods/options/%7B%22limit%22:10%7D/conditions/%7B%22categories.cid%22:1001%7D,http://localhost:10000/qz/schema/Goods/options/%7B%22limit%22:10%7D,http://localhost:10000/qz/schema/Goods/options/%7B%22limit%22:10%7D/fields/%22brand%20clickUrl%20createTime%22

module.exports = (app) ->
  routes = routeHandler.getAllRoutes '/qz/schema/:schema'
  _.each routes, (route) ->
    app.get route, queryHandler


queryHandler = [
  convertQueryHandler
  (req, res, next) ->
    args = req._queryArgs
    args.push (err, docs) ->
      res.json docs
    mongoClient.find.apply mongoClient, args
]

