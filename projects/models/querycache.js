
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appPath, cacheFunctions, config, dbCacheKeyPrefix, logger, myUtil, queryCache, queryList, redisClient, _;

  config = require('../config');

  appPath = config.getAppPath();

  myUtil = require("" + appPath + "/helpers/util");

  logger = require("" + appPath + "/helpers/logger")(__filename);

  _ = require('underscore');

  redisClient = require("" + appPath + "/models/redisclient");

  dbCacheKeyPrefix = config.getDBCacheKeyPrefix();

  cacheFunctions = [];

  queryCache = {
    /**
     * [key 返回该查询条件对应的缓存key,若该方法不可被缓存，直接返回null]
     * @param  {[type]} query         [查询条件]
     * @param  {[type]} func [查询方法名]
     * @return {[type]}               [description]
    */

    key: function(query, func) {
      if (query[2].noCache === true) {
        delete query[2].noCache;
        return null;
      }
      if (this.isCacheAvailable(func)) {
        return dbCacheKeyPrefix + myUtil.sha1(JSON.stringify(query));
      } else {
        return null;
      }
    },
    /**
     * [get 获取key对应的缓存数据]
     * @param  {[type]} key [查询条件对应的hash key]
     * @param  {[type]} cbf [回调函数，参数为: err, data]
     * @return {[type]}     [description]
    */

    get: function(key, cbf) {
      if (key) {
        if (queryList.isQuering(key)) {
          return queryList.addQuery(key, cbf);
        } else {
          queryList.setQuering(key);
          return redisClient.hgetall(key, function(err, data) {
            var cache;
            if (!err && (data != null ? data.cache : void 0)) {
              cache = JSON.parse(data.cache);
              cbf(null, cache);
              return queryList.execQuery(key, cache);
            } else {
              cbf(err, null);
              return queryList.setQuering(key);
            }
          });
        }
      } else {
        cbf(null, null);
        return queryList.setQuering(key);
      }
    },
    /**
     * [set 设置缓存的值]
     * @param {[type]} key  [查询条件对应的hash key]
     * @param {[type]} data [缓存的数据]
     * @param {[type]} ttl  [缓存的TTL]
    */

    set: function(key, data, ttl) {
      if (ttl == null) {
        ttl = 300;
      }
      if (key && data) {
        queryList.execQuery(key, data);
        console.log(key);
        return redisClient.hmset(key, 'cache', JSON.stringify(data), 'createTime', Date.now(), function(err) {
          if (err) {
            return logger.error(err);
          } else {
            return redisClient.expire(key, ttl);
          }
        });
      }
    },
    /**
     * [next 让等待的下一条查询执行]
     * @param  {[type]}   key [查询条件对应的hash key]
     * @return {Function}     [description]
    */

    next: function(key) {
      return queryList.next(key);
    },
    /**
     * [isCacheAvailable 判断该方法类型是否可缓存（有写入的操作都不缓存）]
     * @param  {[type]}  func [方法名]
     * @return {Boolean}               [description]
    */

    isCacheAvailable: function(func) {
      return _.indexOf(cacheFunctions, func, true) !== -1;
    },
    /**
     * [setCacheFunctions 设置可缓存的方法列表名]
     * @param {[type]} functions [可缓存的方法，数组或者以空格隔开的字符串]
    */

    setCacheFunctions: function(functions) {
      if (_.isArray(functions)) {
        return cacheFunctions = functions.sort();
      } else {
        return cacheFunctions = functions.split(' ').sort();
      }
    }
  };

  queryList = {
    /**
     * [queries 保存查询状态的列表]
     * @type {Object}
    */

    queries: {},
    /**
     * [setQuering 设置该key对应的查询为正在查询]
     * @param {[type]} key [查询条件对应的hash key]
    */

    setQuering: function(key) {
      var self;
      self = this;
      if (key) {
        return self.queries[key] = {
          status: 'quering',
          execFunctions: []
        };
      }
    },
    /**
     * [isQuering 判断是否已有相同的查询现在进行]
     * @param  {[type]}  key [查询条件对应的hash key]
     * @return {Boolean}     [description]
    */

    isQuering: function(key) {
      var queries, query, self;
      self = this;
      if (key) {
        queries = self.queries;
        query = queries[key];
        if ((query != null ? query.status : void 0) === 'quering') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    /**
     * [addQuery 添加查询列表（等正在查询的完成时，顺序回调所有的execFunction）]
     * @param {[type]} key [查询条件对应的hash key]
     * @param {[type]} execFunction [查询回调函数]
    */

    addQuery: function(key, execFunction) {
      var queries, query, self;
      self = this;
      if (key && _.isFunction(execFunction)) {
        queries = self.queries;
        query = queries[key];
        if (query != null ? query.execFunctions : void 0) {
          return query.execFunctions.push(execFunction);
        }
      }
    },
    /**
     * [execQuery 执行所有的execFunction函数]
     * @param  {[type]} key  [查询条件对应的hash key]
     * @param  {[type]} data [查询的返回的数据]
     * @return {[type]}      [description]
    */

    execQuery: function(key, data) {
      var dataJSONStr, queries, query, self;
      self = this;
      if (key && data) {
        queries = self.queries;
        query = queries[key];
        dataJSONStr = JSON.stringify(data);
        if (query != null ? query.execFunctions : void 0) {
          _.each(query.execFunctions, function(execFunction) {
            return execFunction(null, JSON.parse(dataJSONStr));
          });
        }
        return delete self.queries[key];
      }
    },
    /**
     * [next 让等待的下一条查询执行]
     * @param  {[type]}   key [查询条件对应的hash key]
     * @return {Function}     [description]
    */

    next: function(key) {
      var execFunction, queries, query, self;
      self = this;
      if (key && data) {
        queries = self.queries;
        query = queries[key];
        if (query != null ? query.execFunctions : void 0) {
          execFunction = query.execFunctions.pop();
          return execFunction(null, null);
        }
      }
    }
  };

  module.exports = queryCache;

}).call(this);
