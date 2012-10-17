_ = require 'underscore'
express = require 'express'
cluster = require 'cluster'
domain = require 'domain'

config = require './config'
appPath = config.getAppPath()

logger = require("#{appPath}/helpers/logger") __filename
beforeRunningHandler = require "#{appPath}/helpers/beforerunninghandler"
staticHandler = require "#{appPath}/helpers/statichandler"
slaveTotal = config.getSlaveTotal()
# varnish = require "#{appPath}/helpers/varnish"


initExpress = () ->
  app = express()
  app.set 'views', "#{appPath}/views"
  app.set 'view engine', 'jade'
  app.engine 'jade', require('jade').__express
  
  ##request by varnish（check node is healthy） just response "success"
  app.use (req, res, next) ->
    userAgent = req.header 'User-Agent'
    if !userAgent
      res.send 'success'
    else
      next()

  app.use express.responseTime()
  app.use staticHandler.static()

  # app.use express.limit '1mb'

  if config.isProductionMode()
    app.use express.logger()

  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()


  app.use app.router
  
  app.use express.errorHandler {
    dumpExceptions : true
    showStack : true
  }

  require("#{appPath}/apps/vicanso/routes")(app)

  require("#{appPath}/apps/ys/routes")(app)

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


