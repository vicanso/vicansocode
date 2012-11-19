_ =require 'underscore'
config = require "#{process._appPath}/config"
appPath = config.getAppPath()
webConfig = require "#{appPath}/apps/chaobaida/helpers/webconfig"
baseConfig = require "#{appPath}/helpers/baseconfig"
viewDataHandler = require "#{appPath}/apps/chaobaida/helpers/viewdatahandler"
logger = require("#{appPath}/helpers/logger") __filename
myUtil = require "#{appPath}/helpers/util"

viewContentHandler = 
  items : (req, res, cbf) ->
    viewDataHandler.items (err, data) ->
      if err
        logger.error err
      else
        viewData =
          title : '要美也要省荷包'
          viewContent : 
            header : webConfig.getHeader 0
            items : data
      cbf viewData

module.exports[key] = func for key, func of viewContentHandler