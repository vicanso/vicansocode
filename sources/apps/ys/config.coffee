config = require '../../config'
APP_NAME = 'ys'
DB_NAME = 'ys'
CONNECT_STRING = config.getDataBaseConnectionStr DB_NAME, config.getDataBaseUser(), config.getDatabasePassword()
config = 
  ###*
   * [getAppName 返回app的名字]
   * @return {[type]} [description]
  ###
  getAppName : () ->
    return APP_NAME
  ###*
   * [getConnectionStr 获取数据库连接字符串]
   * @return {[type]} [description]
  ###
  getConnectionStr : () ->
    return CONNECT_STRING
  ###*
   * [getDataBaseName 获取数据库名称]
   * @return {[type]} [description]
  ###
  getDataBaseName : () ->
    return DB_NAME
module.exports = config