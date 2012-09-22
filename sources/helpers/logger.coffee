
_ = require 'underscore'
config = require '../config'
appPath = config.getAppPath()

getLogger = (runningFile) ->
  logger = require('log4js').getLogger runningFile.replace appPath, ''

module.exports = getLogger
