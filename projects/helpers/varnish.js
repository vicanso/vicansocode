
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var Varnish, appPath, client, config, logger, varnishInfo;

  Varnish = require('node-varnish');

  config = require('../config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  varnishInfo = config.getVarnishInfo();

  client = new Varnish.VarnishClient(varnishInfo.host, varnishInfo.managementPort);

  client.on('ready', function() {
    logger.info('varnish management is ready');
    return client.on('error', function(e) {
      return logger.error(e);
    });
  });

  module.exports = client;

}).call(this);
