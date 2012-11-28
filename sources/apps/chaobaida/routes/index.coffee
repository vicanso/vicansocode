_ = require 'underscore'
config = require "#{process._appPath}/config"
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
      mongoClient.save 'Test', testData1, (err) ->
        logger.warn err
    mongoClient.find.apply mongoClient, args
]

testData1 = 
  name: "街衣"
  clickUrl: "http://s.click.taobao.com/t?e=zGU34CA7K%2BPkqB07S4%2FK0CITy7klxn%2F7bvn0ay1GGYM%2BnyryfcWGT9NxqNxr9Env%2BXbaWcJnubkxNhX76O0%2BU%2BH43bSAsp5VAW%2FtZBbThrC76G4slKJ4w6NH7ELjYnhxohpecvVaT0xKAh0kojxdYrxzI49bjlJXjfJaG29t7SHH2jkDaXyR8LUE1tS%2Bwb6a&unid=chaobaida&spm=2014.12418525.1.0"
  createTime: 1346166761025
  data: 
    adminScore: 0
    buy: 0
    buyNumber: 5
    isAfterpay: false
    isBaoyou: false
    like: 0
    score: 304.39554643518517
    stockNumber: 244
    userId: "194789279"
    view: 0
  delistTime: 1352010621000
  itemId: "10084014184"

testData2 = 
  name : 'aofejaofje'
  type : 'oejaojfeoja'