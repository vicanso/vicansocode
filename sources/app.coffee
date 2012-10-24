_ = require 'underscore'
express = require 'express'
cluster = require 'cluster'
domain = require 'domain'

config = require './config'
appPath = config.getAppPath()

logger = require("#{appPath}/helpers/logger") __filename
beforeRunningHandler = require "#{appPath}/helpers/beforerunninghandler"
staticHandler = require "#{appPath}/helpers/staticHandler"
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
    
  # 静态文件处理函数
  app.use staticHandler.handler()
  
  ##request by varnish（check node is healthy） just response "success"
  app.use (req, res, next) ->
    userAgent = req.header 'User-Agent'
    if !userAgent
      res.send 'success'
    else
      next()

  if !config.isProductionMode()
    # 响应时间
    app.use express.responseTime()
  else
    app.use express.limit '1mb'
    app.use express.logger()

  app.use appInfoParse.handler()


  app.use express.bodyParser()
  app.use express.methodOverride()
  # app.use express.cookieParser()
  
  app.use (req, res, next) ->
    logger.info req.query
    next()

  app.use session.handler()

  app.use (req, res, next) ->
    logger.info '2:'
    sess = req.session
    logger.info sess
    if sess.views
      sess.views++
    else
      sess.views = 1
    next()

  app.use app.router
  
  app.use express.errorHandler {
    dumpExceptions : true
    showStack : true
  }

  

  require("#{appPath}/apps/vicanso/init") app
  require("#{appPath}/apps/ys/init") app

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


