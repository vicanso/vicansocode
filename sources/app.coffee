_ = require 'underscore'
express = require 'express'
cluster = require 'cluster'
domain = require 'domain'

config = require './config'
appPath = config.getAppPath()

logger = require "#{appPath}/helpers/logger"
fileMerger = require "#{appPath}/helpers/filemerger"
staticHandler = require "#{appPath}/helpers/statichandler"
numCPUs = require('os').cpus().length


initExpress = () ->
  app = express()
  app.set 'views', "#{appPath}/views"
  app.set 'view engine', 'jade'
  app.engine 'jade', require('jade').__express
  
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

  app.listen config.getListenPort()

###*
 * [initApp 初始化APP]
 * @return {[type]} [description]
###
initApp = () ->
  if config.isProductionMode() && cluster.isMaster
    config.setMaster()

    while numCPUs
      cluster.fork()
      numCPUs--

    #worker的事件输出，当其中一个worker退出时，启动另外一个worker
    _.each 'fork listen listening online disconnect exit'.split(' '), (event) ->
      cluster.on event, (worker) ->
        logger.error "worker #{worker.process.pid} #{event}"
        if event is 'exit'
          cluster.fork()
  else

    if config.isProductionMode()
      domain = domain.create()
      domain.on 'error', (err) ->
        logger.error "uncaughtException #{err}"
      domain.run () ->
        initExpress()
    else
      #合并文件处理（将部分js,css文件合并）
      fileMerger.mergeFilesBeforeRunning true
      initExpress()

initApp()

