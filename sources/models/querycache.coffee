###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

config = require '../config'
appPath = config.getAppPath()
myUtil = require "#{appPath}/helpers/util"
logger = require("#{appPath}/helpers/logger") __filename
_ = require 'underscore'
redisClient = require "#{appPath}/models/redisclient"
dbCacheKeyPrefix = config.getDBCacheKeyPrefix()
cacheFunctions = []
queryCache = 
  ###*
   * [key 返回该查询条件对应的缓存key,若该方法不可被缓存，直接返回null]
   * @param  {[type]} query         [查询条件]
   * @param  {[type]} func [查询方法名]
   * @return {[type]}               [description]
  ###
  key : (query, func) ->
    # 如果查询条件中还有noCache字段，表示该查询不用缓存，删除该字段以免影响查询结果
    if query[2].noCache == true
      delete query[2].noCache
      return null
    if @isCacheAvailable func
      return dbCacheKeyPrefix + myUtil.sha1 JSON.stringify query
    else
      return null
  ###*
   * [get 获取key对应的缓存数据]
   * @param  {[type]} key [查询条件对应的hash key]
   * @param  {[type]} cbf [回调函数，参数为: err, data]
   * @return {[type]}     [description]
  ###
  get : (key, cbf) ->
    if key
      if queryList.isQuering key
        queryList.addQuery key, cbf
      else
        queryList.setQuering key
        redisClient.hgetall key, (err, data) ->
          if !err && data?.cache
            cache = JSON.parse data.cache
            queryList.execQuery key, cache
            cbf null, cache
          else
            cbf err, null
            queryList.setQuering key
    else
      cbf null, null
  ###*
   * [set 设置缓存的值]
   * @param {[type]} key  [查询条件对应的hash key]
   * @param {[type]} data [缓存的数据]
   * @param {[type]} ttl  [缓存的TTL]
  ###
  set : (key, data, ttl = 300) ->
    if key && data
      queryList.execQuery key, data
      redisClient.hmset key, 'cache', JSON.stringify(data), 'createTime', Date.now(), (err) ->
        if err
          logger.error err
        else
          redisClient.expire key, ttl
  ###*
   * [next 让等待的下一条查询执行]
   * @param  {[type]}   key [查询条件对应的hash key]
   * @return {Function}     [description]
  ###
  next : (key) ->
    queryList.next key
  ###*
   * [isCacheAvailable 判断该方法类型是否可缓存（有写入的操作都不缓存）]
   * @param  {[type]}  func [方法名]
   * @return {Boolean}               [description]
  ###
  isCacheAvailable : (func) ->
    return _.indexOf(cacheFunctions, func, true) != -1
  ###*
   * [setCacheFunctions 设置可缓存的方法列表名]
   * @param {[type]} functions [可缓存的方法，数组或者以空格隔开的字符串]
  ###
  setCacheFunctions : (functions) ->
    if _.isArray functions
      cacheFunctions = functions.sort()
    else
      cacheFunctions = functions.split(' ').sort()

queryList =
  ###*
   * [queries 保存查询状态的列表]
   * @type {Object}
  ###
  queries : {}
  ###*
   * [setQuering 设置该key对应的查询为正在查询]
   * @param {[type]} key [查询条件对应的hash key]
  ###
  setQuering : (key) ->
    self = @
    if key
      self.queries[key] = {
        status : 'quering'
        execFunctions : []
      }
  ###*
   * [isQuering 判断是否已有相同的查询现在进行]
   * @param  {[type]}  key [查询条件对应的hash key]
   * @return {Boolean}     [description]
  ###
  isQuering : (key) ->
    self = @
    if key
      queries = self.queries
      query = queries[key]
      if query?.status == 'quering'
        return true
      else
        return false
    else
      return false
  ###*
   * [addQuery 添加查询列表（等正在查询的完成时，顺序回调所有的execFunction）]
   * @param {[type]} key [查询条件对应的hash key]
   * @param {[type]} execFunction [查询回调函数]
  ###
  addQuery : (key, execFunction) ->
    self = @
    if key && _.isFunction execFunction
      queries = self.queries
      query = queries[key]
      if query?.execFunctions
        query.execFunctions.push execFunction
  ###*
   * [execQuery 执行所有的execFunction函数]
   * @param  {[type]} key  [查询条件对应的hash key]
   * @param  {[type]} data [查询的返回的数据]
   * @return {[type]}      [description]
  ###
  execQuery : (key, data) ->
    self = @
    if key && data
      queries = self.queries
      query = queries[key]
      dataJSONStr = JSON.stringify data
      if query?.execFunctions
        _.each query.execFunctions, (execFunction) ->
          execFunction null, JSON.parse dataJSONStr
      delete self.queries[key]
  ###*
   * [next 让等待的下一条查询执行]
   * @param  {[type]}   key [查询条件对应的hash key]
   * @return {Function}     [description]
  ###
  next : (key) ->
    self = @
    if key && data
      queries = self.queries
      query = queries[key]
      if query?.execFunctions
        execFunction = query.execFunctions.pop()
        execFunction null, null

module.exports = queryCache