###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

express = require 'express'
config = require "#{process._appPath}/config"
appPath = config.getAppPath()

staticHandler =
  ###*
   * [handler 静态文件HTTP请求处理]
   * @return {[type]} [description]
  ###
  handler : () ->
    staticPath = config.getStaticPath()
    staticPrefix = config.getStaticPrefix()
    staticPrefixLength = staticPrefix.length

    staticCompressHandler = express.compress {
      memLevel : 9
    }
    handler = express.static "#{staticPath}", {
      maxAge : config.getStaticFileMaxAge() * 1000,
      redirect : false
    }
    return (req, res, next) ->
      # 先判断该url是否静态文件的请求（请求的前缀固定），如果是则处理该请求（如果可以压缩的则压缩数据）
      if req.url.substring(0, staticPrefixLength) is staticPrefix
        req.url = req.url.substring staticPrefixLength
        staticCompressHandler req, res, () ->
          handler req, res, next
      else
        next()

module.exports[key] = func for key, func of staticHandler
