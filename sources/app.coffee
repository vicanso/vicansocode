_ = require 'underscore'
express = require 'express'
gzippo = require 'gzippo'
cluster = require 'cluster'
domain = require 'domain'

config = require './config'
appPath = config.getAppPath()
fileMerger = require "#{appPath}/helpers/filemerger"
numCPUs = require('os').cpus().length

###*
 * [initApp 初始化APP]
 * @return {[type]} [description]
###
initApp = () ->
  if cluster.isMaster
    config.setMaster()
    #合并文件处理（将部分js,css文件合并）
    fileMerger.mergeFiles true

    while numCPUs
      cluster.fork()
      numCPUs--

    #worker的事件输出，当其中一个worker退出时，启动另外一个worker
    _.each 'fork listen listening online disconnect exit'.split(' '), (event) ->
      cluster.on event, (worker) ->
        console.log "worker #{worker.process.pid} #{event}"
        if event is 'exit'
          cluster.fork()
  else
    domain = domain.create()
    domain.on 'error', (err) ->
      console.error "uncaughtException #{err}"
    domain.run () ->
      fileMerger.mergeFiles()
      app = express()
      app.set 'views', "#{appPath}/views"
      app.set 'view engine', 'jade'
      app.engine 'jade', require('jade').__express

      app.use gzippo.staticGzip "#{appPath}/static", {
        clientMaxAge : 60 * 60 * 1000
        prefix : "#{config.getStaticPrefix()}/"
      }

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

initApp()

