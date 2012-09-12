_ = require 'underscore'
express = require 'express'
gzippo = require 'gzippo'
cluster = require 'cluster'
domain = require 'domain'

config = require './config'

numCPUs = require('os').cpus().length

###*
 * [initApp 初始化APP]
 * @return {[type]} [description]
###
initApp = () ->
  if cluster.isMaster
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
      console.error err
    domain.run () ->
      appPath = config.getAppPath()

      app = express()
      app.set 'views', "#{appPath}/views"
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

