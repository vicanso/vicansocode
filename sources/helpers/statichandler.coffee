express = require 'express'
config = require '../config'
appPath = config.getAppPath()

staticHandler =
  ###*
   * [static 静态文件HTTP请求处理]
   * @return {[type]} [description]
  ###
  static : () ->
    staticPath = config.getStaticPath()
    staticPrefix = config.getStaticPrefix()
    staticPrefixLength = staticPrefix.length

    staticCompressHandler = express.compress {
      memLevel : 9
    }
    staticHandler = express.static "#{staticPath}", {
      maxAge : 60 * 60 * 1000,
      redirect : false
    }
    return (req, res, next) ->
      if req.url.substring(0, staticPrefixLength) is staticPrefix
        req.url = req.url.substring staticPrefixLength
        staticCompressHandler req, res, () ->
        staticHandler req, res, next
      else
        next()

module.exports = staticHandler