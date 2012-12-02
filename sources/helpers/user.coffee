###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

config = require "#{process._appPath}/config"
appPath = config.getAppPath()
session = require "#{appPath}/helpers/session"
sessionParser = require('webtend').middleware.sessionParser()

user =
  loader : () ->
    return sessionParser

module.exports[key] = func for key, func of user
