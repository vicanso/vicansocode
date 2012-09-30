config = require '../config'
_ = require 'underscore'
appPath = config.getAppPath()
redisInfo = config.getRedisInfo()
# redisPort = config.getRedisPort()
client = require('redis').createClient redisInfo.port, redisInfo.host
logger = require("#{appPath}/helpers/logger") __filename

###*
 * [initRedisClient 初始化redis client，将原来client的函数添加到redisClient中，增加对client的调用会先判断是否已连接]
 * @param  {[type]} redisClient [新的redis client]
 * @param  {[type]} client      [原有的redis client]
###
initRedisClient = (redisClient, client) ->
  functions = _.functions client
  _.each functions, (func, i) ->
    redisClient[func] = () ->
      args = Array.prototype.slice.call arguments
      if client.connected
        client[func].apply client, args
      else
        cbf = args.pop()
        if _.isFunction cbf
          cbf
            code : -1
            msg : 'redis is not connected'


logRedisReady = true
client.on 'ready', (err) ->
  if err
    logger.error err
    logRedisReady = true
  if logRedisReady
    logger.info 'redis ready'
    logRedisReady = false
client.on 'error', (err) ->
  if err
    logger.error err
  logRedisReady = true

redisClient = {}
initRedisClient redisClient, client
 
module.exports = redisClient 