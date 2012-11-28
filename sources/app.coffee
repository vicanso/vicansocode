###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

_ = require 'underscore'
express = require 'express'
cluster = require 'cluster'
domain = require 'domain'
fs = require 'fs'

montend = require 'montend'

config = require './config'
appPath = config.getAppPath()
if process._appPath
  console.error 'the _appPath property is exists in process'
process._appPath = appPath

logger = require("#{appPath}/helpers/logger") __filename
myUtil = require "#{appPath}/helpers/util"
MessageHandler = require "#{appPath}/helpers/messagehandler"
beforeRunningHandler = require "#{appPath}/helpers/beforerunninghandler"
staticHandler = require "#{appPath}/helpers/static"
appInfoParse = require "#{appPath}/helpers/appinfoparse"
pageError = require "#{appPath}/helpers/pageerror"
redisClient = require "#{appPath}/models/redisclient"
# varnish = require "#{appPath}/helpers/varnish"


initExpress = () ->
  app = express()
  app.set 'views', config.getViewsPath()
  app.set 'view engine', 'jade'
  app.engine 'jade', require('jade').__express

  
  # 静态文件处理函数
  app.use staticHandler.handler()
  
  # request by varnish（check node is healthy） just response "success"
  # app.use (req, res, next) ->
  #   userAgent = req.header 'User-Agent'
  #   if !userAgent
  #     res.send 'success'
  #   else  
  #     next()

  app.use express.favicon "#{appPath}/static/common/images/favicon.png"

  if !config.isProductionMode()
    app.use express.logger 'dev'
  else
    app.use express.limit '1mb'
    app.use require("#{appPath}/helpers/logger") __filename, 'connectLogger', {
      format : "#{express.logger.default} -- :response-time ms"
    }

  app.use express.timeout config.getResponseTimeout()
  app.use appInfoParse.handler()


  app.use express.bodyParser()
  app.use express.methodOverride()

  
  
  app.use app.router
  
  app.use pageError.handler()


  startApps = (appNames) ->
    _.each appNames, (appName) ->
      if appName.charAt(0) != '.'
        file = "#{appPath}/apps/#{appName}/init"
        myUtil.requireFileExists file, (exists) ->
          if exists
            require(file) app

  startAppList = config.getStartAppList()
  if startAppList == 'all'
    fs.readdir "#{appPath}/apps", (err, files) ->
      startApps files
  else
    startApps startAppList

  app.listen config.getListenPort()

  logger.info "listen port #{config.getListenPort()}"


###*
 * [initApp 初始化APP]
 * @return {[type]} [description]
###
initApp = () ->
  if config.isProductionMode() && config.isMaster()
    beforeRunningHandler.run()
    slaverTotal = config.getSlaverTotal()
    while slaverTotal
      worker = cluster.fork()
      slaverTotal--

    #worker的事件输出，当其中一个worker退出时，启动另外一个worker
    _.each 'fork listening online'.split(' '), (event) ->
      cluster.on event, (worker) ->
        logger.info "worker #{worker.process.pid} #{event}"
    cluster.on 'exit', (worker) ->
      logger.error "worker #{worker.process.pid} exit"
      cluster.fork()
  else
    beforeRunningHandler.run()
    if config.isProductionMode()
      domain = domain.create()
      domain.on 'error', (err) ->
        logger.error err
      domain.run () ->
        initExpress()
    else
      initExpress()

  #   if config.getUID() == 4
  #     setTimeout () ->
  #       messageHandler.send 0
  #     , 5000
  # messageHandler = new MessageHandler cluster
  # messageHandler.on 'message', (m) ->
  #   logger.warn m



initApp()



montend = require 'montend'
montend.createConnection 'mongodb://vicanso:86545610@localhost:10020/vicanso,mongodb://localhost:10020/goods', (err) ->
  console.warn 'init success'
  if err
    console.error err
  # montend.find 'goods', 'goods', {}, {}, {limit : 30}, (err, docs) ->
  #   console.log err
  #   console.log docs
  montend.setConfig {
    logQueryTime : true
    logger : logger
    queryCache : true
    # redisClient : redisClient
    # disableLog : true
  }
  goodsClient = montend.getClient 'goods'
  goodsClient.find 'goods', {'categories.cid' : '1001'}, 'itemId title', (err, docs) ->
    logger.info docs.length
  goodsClient.count 'goods', {'categories.cid' : '1001'}, (err, count) ->
    logger.info count
  goodsClient.count 'goods', {'categories.cid' : '1001'}, (err, count) ->
    logger.info count
  goodsClient.count 'goods', {'categories.cid' : '1001'}, (err, count) ->
    logger.info count
