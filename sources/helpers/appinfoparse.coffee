_ = require 'underscore'

parserList = []
defaultAppInfo = 
  app : 'all'

appInfoParse = 
  ###*
   * [handler 转换app信息的函数处理（会顺序的调用处理函数列表，如果某一函数有返回结果，则处理完成。否则，返回默认的配置信息）]
   * @return {[type]} [description]
  ###
  handler : () ->
    return (req, res, next) ->
      appInfo = null
      _.each parserList, (parse) ->
        if !appInfo
          appInfo = parse req
          req.appInfo = appInfo
      if !appInfo
        appInfo = defaultAppInfo
      next()
  ###*
   * [getAppName 获取app的名字]
   * @param  {[type]} req [request对象]
   * @return {[type]}     [description]
  ###
  getAppName : (req) ->
    return req.appInfo?.app
  ###*
   * [addParser 添加app信息的parser函数]
   * @param {[type]} func [description]
  ###
  addParser : (func) ->
    if _.isFunction func
      parserList.push func

module.exports = appInfoParse