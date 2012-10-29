###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

Varnish = require 'node-varnish'
config = require '../config'
appPath = config.getAppPath()
logger = require("#{appPath}/helpers/logger") __filename


varnishInfo = config.getVarnishInfo()
client = new Varnish.VarnishClient varnishInfo.host, varnishInfo.managementPort

client.on 'ready', () ->
  logger.info 'varnish management is ready'
  client.on 'error', (e) ->
    logger.error e


module.exports = client

