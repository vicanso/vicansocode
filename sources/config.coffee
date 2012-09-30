path = require 'path'

# APP路径
APP_PATH = __dirname
# 运行的模式是否为production
IS_PRODUCTION_MODE = process.env.NODE_ENV is 'production'
# 静态文件的HTTP请求前缀
STATIC_PREFIX = '/static'
# 静态文件目录
STATIC_PATH = path.join APP_PATH, STATIC_PREFIX
# 临时文件（根据网页合并的css,js文件）HTTP请求前缀
TEMP_STATIC_PREFIX = STATIC_PREFIX + '/temp'
# 临时文件目录
TEMP_STATIC_PATH = path.join APP_PATH, TEMP_STATIC_PREFIX
# 监听的目录
LISTEN_PORT = 10000
# redis的配置信息
REDIS_INFO = 
  port : 10010
  host : '127.0.0.1'
# mongo的配置信息
MONGO_INFO =
  port :10020
  host : '127.0.0.1'
  poolsize : 16
# 是否master
IS_MASTER = false
# slave的总数
SLAVE_TOTAL = require('os').cpus().length
# 合并文件信息的json配置
MERGE_FILES = require "#{APP_PATH}/mergefiles.json"
config = 
  ###*
   * [getAppPath 返回APP的所在的目录]
   * @return {[type]} [description]
  ###
  getAppPath : () ->
    return APP_PATH

  ###*
   * [isProductionMode 判断当前APP是否运行在production环境下]
   * @return {Boolean} [description]
  ###
  isProductionMode : () ->
    return IS_PRODUCTION_MODE
    
  ###*
   * [getListenPort 返回APP的监听端口]
   * @return {[type]} [description]
  ###
  getListenPort : () ->
    return LISTEN_PORT

  ###*
   * [getStaticPrefix 返回静态文件请求的HTTP请缀]
   * @return {[type]} [description]
  ###
  getStaticPrefix : () ->
    return STATIC_PREFIX

  getTempStaticPrefix : () ->
    return TEMP_STATIC_PREFIX
  ###*
   * [setMaster 设置其为master]
  ###
  setMaster : () ->
    IS_MASTER = true

  ###*
   * [isMaster 是否master，在程序运行之后才去设置，因此不要在require config之后就直接调用]
   * @return {Boolean} [description]
  ###
  isMaster : () ->
    return IS_MASTER

  getStaticPath : () ->
    return STATIC_PATH
  ###*
   * [getTempPath 获取临时目录，该目录存放css,js的合并文件]
   * @return {[type]} [description]
  ###
  getTempPath : () ->
    return path.join APP_PATH, TEMP_STATIC_PREFIX
  ###*
   * [getMergeFiles 返回合并文件列表]
   * @return {[type]} [description]
  ###
  getMergeFiles : () ->
    return MERGE_FILES
  ###*
   * [getRedisPort 返回redis的一些配置信息]
   * @return {[type]} [description]
  ###
  getRedisInfo : () ->
    return REDIS_INFO
  ###*
   * [getMongoInfo 返回mongo一些配置信息]
   * @return {[type]} [description]
  ###
  getMongoInfo : () ->
    return MONGO_INFO
  ###*
   * [getSlaveTotal 返回从进程的总数]
   * @return {[type]} [description]
  ###
  getSlaveTotal : () ->
    return SLAVE_TOTAL

module.exports = config
