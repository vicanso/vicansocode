###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

express = require 'express'
config = require '../config'
isProductionMode = config.isProductionMode()
pageError = 
  ###*
   * [handler 返回错误信息处理函数]
   * @return {[type]} [description]
  ###
  handler : () ->
    if isProductionMode
      return (err, req, res) ->
        # TODO add production error page
        
    else
      return express.errorHandler {
        dumpExceptions : true
        showStack : true
      }
  ###*
   * [error 返回错误对象]
   * @param  {[type]} status [http状态码]
   * @param  {[type]} msg    [出错信息]
   * @return {[type]}        [description]
  ###
  error : (status, msg) ->
    err = new Error msg
    err.status = status
    return err

module.exports[key] = func for key, func of pageError
