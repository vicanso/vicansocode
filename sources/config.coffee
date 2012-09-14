path = require 'path'

APP_PATH = __dirname
RUNNING_MODE = process.env.NODE_ENV is 'production'
STATIC_PREFIX = '/static'
LISTEN_PORT = 10000
IS_MASTER = false

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
    return RUNNING_MODE
    
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

  ###*
   * [setMaster 设置其为master]
  ###
  setMaster : () ->
    IS_MASTER = true

  ###*
   * [isMaster 是否master]
   * @return {Boolean} [description]
  ###
  isMaster : () ->
    return IS_MASTER

  ###*
   * [getTempPath 获取临时目录，该目录存放css,js的合并文件]
   * @return {[type]} [description]
  ###
  getTempPath : () ->
    return path.join APP_PATH, 'static/temp'

module.exports = config
