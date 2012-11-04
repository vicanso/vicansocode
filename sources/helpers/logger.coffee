###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

_ = require 'underscore'
config = require '../config'
appPath = config.getAppPath()
uid = config.getUID()
###*
 * [getLogger 返回logger对象（输出信息包含调用该logger的文件名）]
 * @param  {[type]} runningFile [description]
 * @return {[type]}             [description]
###
getLogger = (runningFile) ->
  loggerFile = runningFile.replace appPath, ''
  logger = require('log4js').getLogger "node:#{uid} #{loggerFile}"

module.exports = getLogger
