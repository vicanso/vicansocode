###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

_ = require 'underscore'
log4js = require 'log4js'
config = require "#{process._appPath}/config"
appPath = config.getAppPath()
uid = config.getUID()

if config.isProductionMode()
  appenders = [
    {
      type : 'file'
      filename : config.getLogFileName()
    }
  ]
else
  appenders = [
    {
      type : 'console'
    }
  ]

log4js.configure {
  appenders : appenders
  replaceConsole: true
}
log4js.loadAppender 'file'


###*
 * [getLogger 返回logger对象（输出信息包含调用该logger的文件名）]
 * @param  {[type]} runningFile [description]
 * @return {[type]}             [description]
###
getLogger = (runningFile, type = 'normal', options) ->
  loggerFile = runningFile.replace appPath, ''
  logger = log4js.getLogger "node:#{uid} #{loggerFile}"
  errorLog = logger.error
  logger.error = (msg) ->
    args = _.toArray arguments
    err = new Error()
    info = err.stack.split('\n')[2]
    args.unshift info.trim().replace "#{runningFile}:", ''
    errorLog.apply logger, args
  switch type
    when 'normal' then return logger
    when 'connectLogger' then return log4js.connectLogger logger, options

module.exports = getLogger
