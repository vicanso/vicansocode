###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

_ = require 'underscore'
express = require 'express'
cluster = require 'cluster'
domain = require 'domain'
fs = require 'fs'

config = require './config'
appPath = config.getAppPath()

logger = require("#{appPath}/helpers/logger") __filename
beforeRunningHandler = require "#{appPath}/helpers/beforerunninghandler"
staticHandler = require "#{appPath}/helpers/static"
slaveTotal = config.getSlaveTotal()
myUtil = require "#{appPath}/helpers/util"
session = require "#{appPath}/helpers/session"
appInfoParse = require "#{appPath}/helpers/appinfoparse"
# varnish = require "#{appPath}/helpers/varnish"


initExpress = () ->
  app = express()
  app.set 'views', "#{appPath}/views"
  app.set 'view engine', 'jade'
  app.engine 'jade', require('jade').__express

  express.logger.format 'production', "#{express.logger.default} - :response-time ms"
    
  # 静态文件处理函数
  app.use staticHandler.handler()
  
  # request by varnish（check node is healthy） just response "success"
  app.use (req, res, next) ->
    userAgent = req.header 'User-Agent'
    if !userAgent
      res.send 'success'
    else
      next()

  app.use express.favicon "#{appPath}/static/common/images/favicon.png"

  if !config.isProductionMode()
    app.use express.logger 'dev'
  else
    app.use express.limit '1mb'
    app.use express.logger 'production'

  app.use appInfoParse.handler()




  app.use express.bodyParser()
  app.use express.methodOverride()



  app.use app.router
  
  app.use express.errorHandler {
    dumpExceptions : true
    showStack : true
  }

  
  startAppList = config.getStartAppList()
  if startAppList == 'all'
    fs.readdir "#{appPath}/apps", (err, files) ->
      _.each files, (appName) ->
        if appName[0] != '.'
          require("#{appPath}/apps/#{appName}/init") app
  else
    _.each startAppList, (appName) ->
      require("#{appPath}/apps/#{appName}/init") app
  # require("#{appPath}/apps/vicanso/init") app
  # require("#{appPath}/apps/ys/init") app

  app.listen config.getListenPort()

  logger.info "listen port #{config.getListenPort()}"


###*
 * [initApp 初始化APP]
 * @return {[type]} [description]
###
initApp = () ->
  if config.isProductionMode() && config.isMaster()
    beforeRunningHandler.run()
    while slaveTotal
      cluster.fork()
      slaveTotal--

    #worker的事件输出，当其中一个worker退出时，启动另外一个worker
    _.each 'fork listening online'.split(' '), (event) ->
      cluster.on event, (worker) ->
        logger.info "worker #{worker.process.pid} #{event}"
    cluster.on 'exit', (worker) ->
      logger.error "worker #{worker.process.pid} #{event}"
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

initApp()


