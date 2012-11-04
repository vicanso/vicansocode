###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

config = require '../config'
_ = require 'underscore'
mongoose = require 'mongoose'
Schema = mongoose.Schema
appPath = config.getAppPath()
mongoInfo = config.getMongoInfo()
logger = require("#{appPath}/helpers/logger") __filename
queryCache = require "#{appPath}/models/querycache"
isLoggerQueryInfo = config.isLoggerQueryInfo()
isCacheQueryResult = config.isCacheQueryResult()
connectionOptions =
  server : 
    poolSize : mongoInfo.poolSize
  db : 
    native_parser : false

 

mongoClient =
  ###*
   * [getClient 返回一个新的mongoclient对象，调用相应的方法时，不再输入传alias参数]
   * @param  {[type]} alias   [数据库连接别名]
   * @param  {[type]} uri     [数据库连接地址]
   * @param  {[type]} schemas [schemas列表]
   * @return {[type]}         [description]
  ###
  getClient : (alias, uri, schemas) ->
    self = @
    mongoClient = {}
    _.each _.functions(self), (func) ->
      if func != 'getClient'
        mongoClient[func] = () ->
          if !_.isFunction self[func]
            logger.error "call mongoClient function: #{func} is not defined"
          else
            args = _.toArray arguments
            args.unshift alias  
            self[func].apply self, args
    mongoClient.createConnection uri
    _.each schemas, (model, name) ->
      mongoClient.model name, model
    return mongoClient
  ###*
   * [createConnection 创建mongo数据库连接]
   * @param  {[type]} alias [数据库连接别名（用于获取该连接）]
   * @param  {[type]} uri   [数据库连接字符串]
   * @param  {[type]} options [数据库连接选项]
   * @return {[type]}       [description]
  ###
  createConnection : (alias, uri, options = connectionOptions) ->
    conn = dataBaseHandler.getConnection alias
    if !conn
      conn = mongoose.createConnection uri, options, (err) ->
        if err
          logger.error err
        else
          logger.info uri
      dataBaseHandler.setDBInfo {
        uri : uri
        conn : conn
        alias : alias
      }
    return conn
  ###*
   * [getConnection 返回数据库连接]
   * @param  {[type]} alias [数据库连接别名]
   * @return {[type]}       [description]
  ###
  getConnection : (alias) ->
    return dataBaseHandler.getConnection alias
  ###*
   * [model 获取或设置数据库model]
   * @param  {[type]} alias    [数据库连接别名]
   * @param  {[type]} name     [model名字]
   * @param  {[type]} modelObj [model的参数实例（若无该参数则是获取）]
   * @return {[type]}          [description]
  ###
  model : (alias, name, modelObj) ->
    args = _.toArray arguments
    return dataBaseHandler.model.apply dataBaseHandler, args
  ###*
   * [find 查询方法]
   * @param  {[type]} alias   [数据库连接别名]
   * @param  {[type]} name    [model名字]
   * @param  {[type]} conditions [查询条件]
   * @param  {[type]} fields [optional][查询返回字段]
   * @param  {[type]} options [optional][]
   * @param  {[type]} cbf     [回调函数]
   * @return {[type]}         [description]
  ###
  find : (alias, name, conditions, fields, options, cbf) ->
    args = _.toArray arguments
    args.push wrapMongooseCallback 'toObject', args.pop()
    return dataBaseHandler.find.apply dataBaseHandler, args
  ###*
   * [findById 通过id查找对象]
   * @param  {[type]} alias   [数据库连接别名]
   * @param  {[type]} name    [model名字]
   * @param  {[type]} id [对象id]
   * @param  {[type]} fields [optional][查询返回字段]
   * @param  {[type]} options [optional][]
   * @param  {[type]} cbf     [回调函数]
   * @return {[type]}         [description]
  ###
  findById : (alias, name, id, fields, options, cbf) ->
    args = _.toArray arguments
    args.push wrapMongooseCallback 'toObject', args.pop()
    return dataBaseHandler.findById.apply dataBaseHandler, args
  ###*
   * [findByIdAndUpdate 通过id查找对象并修改]
   * @param  {[type]} alias   [数据库连接别名]
   * @param  {[type]} name    [model名字]
   * @param  {[type]} id      [对象id]
   * @param  {[type]} data  [更新的数据]
   * @param  {[type]} options [一些更新配置信息]
   * @param  {[type]} cbf     [回调函数]
   * @return {[type]}         [description]
  ###
  findByIdAndUpdate : (alias, name, id, data, options, cbf) ->
    args = _.toArray arguments
    return dataBaseHandler.findByIdAndUpdate.apply dataBaseHandler, args
  ###*
   * [findOne 查找符合条件的一个数据]
   * @param  {[type]} alias   [数据库连接别名]
   * @param  {[type]} name    [model名字]
   * @param  {[type]} conditions [查询条件]
   * @param  {[type]} fields [optional][查询返回字段]
   * @param  {[type]} options [optional][]
   * @param  {[type]} cbf     [回调函数]
   * @return {[type]}         [description]
  ###
  findOne : (alias, name, conditions, fields, options, cbf) ->
    args = _.toArray arguments
    args.push wrapMongooseCallback 'toObject', args.pop()
    return dataBaseHandler.findOne.apply dataBaseHandler, args
  ###*
   * [findOneAndUpdate 查找一个数据并更新]
   * @param  {[type]} alias      [数据库连接别名]
   * @param  {[type]} name       [model名字]
   * @param  {[type]} conditions [查询条件]
   * @param  {[type]} update     [更新的数据]
   * @param  {[type]} options    [一些更新配置信息]
   * @param  {[type]} cbf        [回调函数]
   * @return {[type]}            [description]
  ###
  findOneAndUpdate : (alias, name, conditions, update, options, cbf) ->
    args = _.toArray arguments
    return dataBaseHandler.findOneAndUpdate.apply dataBaseHandler, args
  ###*
   * [count 返回符合查询条件的总数]
   * @param  {[type]} alias      [数据库连接别名]
   * @param  {[type]} name       [model名字]
   * @param  {[type]} conditions [查询条件]
   * @param  {[type]} cbf        [回调函数]
   * @return {[type]}            [description]
  ###
  count : (alias, name, conditions, cbf) ->
    args = _.toArray arguments
    return dataBaseHandler.count.apply dataBaseHandler, args
  ###*
   * [save 保存对象]
   * @param  {[type]} alias [数据库连接别名]
   * @param  {[type]} name  [model名字]
   * @param  {[type]} data  [对象]
   * @param  {[type]} cbf   [回调函数]
   * @return {[type]}       [description]
  ###
  save : (alias, name, data, cbf) ->
    args = _.toArray arguments
    return dataBaseHandler.save.apply dataBaseHandler, args
  removeById : (alias, name, id, cbf) ->
    args = _.toArray arguments
    return dataBaseHandler.removeById.apply dataBaseHandler, args


dataBaseHandler = 
  ###*
   * [dbInfos 保存每个数据库的一些信息（uri，初始化后的connnection，alias，model列表）]
   * @type {Object}
  ###
  dbInfos : {}
  ###*
   * [getConnection 返回数据库连接]
   * @param  {[type]} alias [数据库连接别名]
   * @return {[type]}       [description]
  ###
  getConnection : (alias) ->
    self = @
    dbInfo = self.getDBInfo alias
    if dbInfo
      return dbInfo.conn
    else
      return null
  ###*
   * [getDBInfo 返回数据库信息]
   * @param  {[type]} alias [数据库连接别名]
   * @return {[type]}       [description]
  ###
  getDBInfo : (alias) ->
    return @dbInfos[alias]

  ###*
   * [setDBInfo 设置数据库信息]
   * @param {[type]} info [保存每个数据库的一些信息（uri，初始化后的connnection，alias，model列表]
  ###
  setDBInfo : (info) ->
    defaults = 
      uri : ''
      conn : ''
      alias : ''
      models : {}
    alias = info.alias
    if _.isString(alias) && alias.length > 0
      @dbInfos[info.alias] = _.extend defaults, info
  ###*
   * [model 获取或设置数据库model]
   * @param  {[type]} alias    [数据库连接别名]
   * @param  {[type]} name     [model名字]
   * @param  {[type]} modelObj [model的参数实例（若无该参数则是获取）]
   * @return {[type]}          [description]
  ###
  model : (alias, name, modelObj) ->
    self = @
    dbInfo = self.getDBInfo alias
    models = dbInfo.models
    conn = dbInfo.conn
    if modelObj
      if conn
        schema = new Schema modelObj
        model = conn.model name, schema
        models[name] = model
    else
      return models[name]
  ###*
   * [save 保存对象]
   * @param  {[type]} alias [数据库连接别名]
   * @param  {[type]} name  [model名字]
   * @param  {[type]} data  [对象]
   * @param  {[type]} cbf   [回调函数]
   * @return {[type]}       [description]
  ### 
  save : (alias, name, data, cbf) ->
    self = @
    model = self.model alias, name
    new model(data).save cbf
  removeById : (alias, name, id, cbf) ->
    return null
  ###*
   * [count 返回符合查询条件的总数]
   * @param  {[type]} alias      [数据库连接别名]
   * @param  {[type]} name       [model名字]
   * @param  {[type]} conditions [查询条件]
   * @param  {[type]} cbf        [回调函数]
   * @return {[type]}            [description]
  ###
  count : (alias, name, conditions, cbf) ->
    self = @
    model = self.model alias, name
    model.count conditions, cbf


# 将mongoose的model方法添加到dataBaseHandler中
modelFunctions = 'find findById findByIdAndUpdate findOne findOneAndUpdate'
_.each modelFunctions.split(' '), (func) ->
  dataBaseHandler[func] = () ->
    self = @
    args = _.toArray arguments
    # 查询条件中是否带缓存的ttl
    ttl = args[2]?.ttl
    if ttl
      delete args[2].ttl
    cbf = args.pop()
    # 生成新的查询函数，主要是添加查询时间的记录以及一些缓存的处理
    queryFunc = () ->
      args.push cbf
      args.unshift self, func
      if isLoggerQueryInfo
        queryInfo = new QueryInfo args.slice 1
      args[args.length - 1] = (err, data) ->
        if isCacheQueryResult
          if !err && data
            queryCache.set key, data, ttl
          else
            queryCache.next key
        if queryInfo
          queryInfo.complete()
          logger.info queryInfo.toString()
        args = _.toArray arguments
        cbf.apply null, args
      mongooseModel.apply null, args      
    if isCacheQueryResult
      key = queryCache.key args, func
      queryCache.get key, (err, data) ->
        if !err && data
          cbf null, data
        else
          queryFunc()
    else
      queryFunc()
# 设置可以缓存的查询
queryCache.setCacheFunctions 'findOne find findById'
###*
 * [mongooseModel mongoose中model的一些方法]
 * @param  {[type]} dbHandler [description]
 * @param  {[type]} func      [description]
 * @param  {[type]} alias     [description]
 * @param  {[type]} name      [description]
 * @param  {[type]} args...   [description]
 * @return {[type]}           [description]
###
mongooseModel = (dbHandler, func, alias, name, args...) ->
  model = dbHandler.model alias, name
  if !model
    return null
  return model[func].apply model, args

###*
 * [wrapMongooseCallback 包裹mongoose的callback函数，对callback作一些处理]
 * @param  {[type]} type [对callback处理的类型]
 * @param  {[type]} func [description]
 * @return {[type]}      [description]
###
wrapMongooseCallback = (type, func) ->
  switch type
    when 'toObject' then return transformDataToObject func

###*
 * [transformDataToObject 将mongoose返回的数据转换为Obejct]
 * @param  {[type]} func [回调的函数]
 * @return {[type]}      [description]
###
transformDataToObject = (func) ->
  return (err, data) ->
    if data && _.isFunction data.toObject
      data = data.toObject()
    func err, data


class QueryInfo
  constructor : (queryInfo) ->
    @start = Date.now()
    @end = @start
    @queryInfo = queryInfo || null
  ###*
   * [start 设置开始时间]
   * @return {[type]} [description]
  ###
  start : () ->
    self = @
    self.start = Date.now()
    return self
  ###*
   * [complete 设置结束时间]
   * @return {[type]} [description]
  ###
  complete : () ->
    self = @
    self.end = Date.now()
    return self
  ###*
   * [queryInfo 设置或返回查询条件]
   * @param  {[type]} queryInfo [查询条件（可选）]
   * @return {[type]}           [description]
  ###
  queryInfo : (queryInfo) ->
    self = @
    if queryInfo
      self.queryInfo = queryInfo
    return self.queryInfo
  ###*
   * [toString 将查询的一些相关信息转化为字符串]
   * @return {[type]} [description]
  ###
  toString : () ->
    self = @
    usedTime = self.end - self.start
    queryInfo = self.queryInfo
    queryStr = ''
    if _.isArray queryInfo
      _.each queryInfo, (info) ->
        if !_.isFunction info
          if _.isString info
            queryStr += "#{info}, "
          else
            queryStr += "#{JSON.stringify(info)}, "
    else
      queryStr = queryInfo.toString()
    return "#{queryStr} used time: #{usedTime}ms"

module.exports = mongoClient
