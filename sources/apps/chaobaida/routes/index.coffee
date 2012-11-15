_ = require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
viewContentHandler = require "#{appPath}/apps/chaobaida/helpers/viewcontenthandler"
routeHandler = require "#{appPath}/helpers/routehandler"
myUtil = require "#{appPath}/helpers/util"
user = require "#{appPath}/helpers/user"
pageError = require "#{appPath}/helpers/pageerror"
userLoader = user.loader()

routeInfos = [
  {
    type : 'get'
    route : '/qz/shb/items'
    jadeView : 'chaobaida/items'
    handerFunc : 'items'
  }
]

module.exports = (app) ->
  routeHandler.initRoutes app, routeInfos, viewContentHandler

  # setTimeout () ->
  #   mongoClient.find "Good", {
  #     delistTime : 
  #       '$gt' : 1352961900000
  #     itemPrice : 
  #       '$lt' : 100
  #     'categories.cid' : 100101
  #   }, '', {
  #     limit : 30
  #   }, (err, docs) ->
  #     console.log docs.length
  # , 2000