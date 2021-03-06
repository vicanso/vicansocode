###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

path = require 'path'
cluster = require 'cluster'
commander = require 'commander'


###*
 * [initArguments 初始化启动参数]
 * @param  {[type]} program [commander模块]
 * @return {[type]}         [description]
###
initArguments = (program) ->
  splitArgs = (val) ->
    return val.split ','
  program.version('0.0.1')
  .option('-p, --port <n>', 'listen port', parseInt)
  .option('-s, --slaver <n>', 'slaver total', parseInt)
  .option('-u, --user <n>', 'database user')
  .option('-w, --password <n>', 'database password')
  .option('-l, --list <items>', 'the app list, separated by ","', splitArgs)
  .option('--log <n>', 'the log file\'s path(in production mode)')
  .option('--dbcachekey <n>', 'db cache key prefix')
  .option('--mongohost <n>', 'mongodb host')
  .option('--mongoport <n>', 'mongodb port', parseInt)
  .option('--redishost <n>', 'redis host')
  .option('--redisport <n>', 'redis port', parseInt)
  .parse process.argv

initArguments commander

# APP路径
APP_PATH = __dirname
# 运行的模式是否为production
IS_PRODUCTION_MODE = process.env.NODE_ENV is 'production'
# 静态文件的HTTP请求前缀
STATIC_PREFIX = '/static'
# 静态文件的HTTP缓存时间(单位秒)
STATIC_FILE_MAX_AGE = 15 * 60
# views的目录
VIEWS_PATH = "#{APP_PATH}/views"
# 静态文件目录
STATIC_PATH = path.join APP_PATH, STATIC_PREFIX
# 临时文件（根据网页合并的css,js文件）HTTP请求前缀
TEMP_STATIC_PREFIX = STATIC_PREFIX + '/temp'
# 临时文件目录
TEMP_STATIC_PATH = path.join APP_PATH, TEMP_STATIC_PREFIX
# 监听的目录
LISTEN_PORT = commander.port || 10000
# redis的配置信息
REDIS_INFO = 
  port : commander.redisport || 10010
  host : commander.redishost || '127.0.0.1'
# mongo的配置信息
MONGO_INFO =
  port : commander.mongoport || 10020
  host : commander.mongohost || '127.0.0.1'
  poolsize : 16
# varnish的配置信息
VARNISH_INFO =
  managementPort : 10030
  host : '127.0.0.1'
# slaver的总数
SLAVER_TOTAL = commander.slaver || require('os').cpus().length
# 数据库用户名
DATA_BASE_USER = commander.user
# 数据库的密码
DATA_BASE_PWD = commander.password
# 合并文件信息的json配置
MERGE_FILES = require "#{APP_PATH}/mergefiles.json"
# 启动的app列表
START_APP_LIST = commander.list || 'all'
# 是否记录查询数据的一些信息
LOGGER_QUERY_INFO = true
# 是否缓存查询记录
CACHE_QUERY_RESULT = IS_PRODUCTION_MODE
# http响应超时单位ms
RESPONSE_TIME_OUT = 5000
# 缓存数据库查询的cache的key前缀
DB_CACHE_KEY_PREFIX = commander.dbcachekey || 'dbcache_'
# log文件
LOG_FILE_Name = commander.log || '/var/log/node/log'
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
  ###*
   * [getTempStaticPrefix 返回临时文件目录的前缀（该目录主要用于保存网页中的所有css,js合并文件）]
   * @return {[type]} [description]
  ###
  getTempStaticPrefix : () ->
    return TEMP_STATIC_PREFIX
  ###*
   * [isMaster 是否master，在程序运行之后才去设置，因此不要在require config之后就直接调用]
   * @return {Boolean} [description]
  ###
  isMaster : () ->
    return cluster.isMaster || false
  ###*
   * [getViewsPath 返回view的目录]
   * @return {[type]} [description]
  ###
  getViewsPath : () ->
    return convertStaticPath VIEWS_PATH
  ###*
   * [getStaticPath 返回静态文件路径]
   * @return {[type]} [description]
  ###
  getStaticPath : () ->
    return convertStaticPath STATIC_PATH
  ###*
   * [getStaticFileMaxAge 返回静态文件的HTTP缓存时间，以second为单位]
   * @return {[type]} [description]
  ###
  getStaticFileMaxAge : () ->
    return STATIC_FILE_MAX_AGE
  ###*
   * [getTempPath 获取临时目录，该目录存放css,js的合并文件]
   * @return {[type]} [description]
  ###
  getTempPath : () ->
    return convertStaticPath path.join APP_PATH, TEMP_STATIC_PREFIX
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
  getSlaverTotal : () ->
    return SLAVER_TOTAL
  ###*
   * [getVarnishInfo 获取varnish的一些配置信息]
   * @return {[type]} [description]
  ###
  getVarnishInfo : () ->
    return VARNISH_INFO
  ###*
   * [isLoggerQueryInfo 是否记录查询的Query信息]
   * @return {Boolean} [description]
  ###
  isLoggerQueryInfo : () ->
    return LOGGER_QUERY_INFO
  ###*
   * [isCacheQueryResult 是否缓存query结果]
   * @return {Boolean} [description]
  ###
  isCacheQueryResult : () ->
    return CACHE_QUERY_RESULT
  ###*
   * [getDatabasePassword 返回数据库的密码]
   * @return {[type]} [description]
  ###
  getDatabasePassword : () ->
    return DATA_BASE_PWD
  ###*
   * [getDataBaseUser 返回数据库的用户名]
   * @return {[type]} [description]
  ###
  getDataBaseUser : () ->
    return DATA_BASE_USER
  ###*
   * [getStartAppList 获取启动app的列表]
   * @return {[type]} [description]
  ###
  getStartAppList : () ->
    return START_APP_LIST
  ###*
   * [getUID 获取node的uid(如果是master则返回0)]
   * @return {[type]} [description]
  ###
  getUID : () ->
    if @isMaster()
      return 0
    else
      return cluster.worker?.uniqueID || -1
  ###*
   * [getDataBaseConnectionStr 返回数据库的连接字符串]
   * @param  {[type]} db       [数据库名]
   * @param  {[type]} user     [数据库登录用户，若无认证则为空]
   * @param  {[type]} password [登录密码]
   * @return {[type]}          [description]
  ###
  getDataBaseConnectionStr : (db, user, password) ->
    if user && password
      return "mongodb://#{user}:#{password}@#{MONGO_INFO.host}:#{MONGO_INFO.port}/#{db}"
    else
      return "mongodb://#{MONGO_INFO.host}:#{MONGO_INFO.port}/#{db}"
  ###*
   * [getResponseTimeout 返回响应超时的时间]
   * @return {[type]} [description]
  ###
  getResponseTimeout : () ->
    return RESPONSE_TIME_OUT
  ###*
   * [getDBCacheKeyPrefix 返回db缓存key的前缀]
   * @return {[type]} [description]
  ###
  getDBCacheKeyPrefix : () ->
    return DB_CACHE_KEY_PREFIX
  ###*
   * [getLogFile 返回log文件的地址]
   * @return {[type]} [description]
  ###
  getLogFileName : () ->
    return LOG_FILE_Name

convertStaticPath = (path) ->
  return path
  # return path.replace '/sources', '/projects'

module.exports[key] = func for key, func of config
  