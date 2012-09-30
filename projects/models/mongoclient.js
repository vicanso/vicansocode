(function() {
  var Schema, appPath, config, connectionOptions, dataBaseHandler, logger, modelFunctions, mongoClient, mongoInfo, mongoose, mongooseModel, transformDataToObject, wrapMongooseCallback, _,
    __slice = [].slice;

  config = require('../config');

  _ = require('underscore');

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  appPath = config.getAppPath();

  mongoInfo = config.getMongoInfo();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  connectionOptions = {
    server: {
      poolSize: mongoInfo.poolSize
    },
    db: {
      native_parser: true
    }
  };

  mongoClient = {
    /**
     * [createConnection 创建mongo数据库连接]
     * @param  {[type]} alias [数据库连接别名（用于获取该连接）]
     * @param  {[type]} uri   [数据库连接字符串]
     * @return {[type]}       [description]
    */

    createConnection: function(alias, uri) {
      var conn;
      conn = dataBaseHandler.getConnection(alias);
      if (!conn) {
        conn = mongoose.createConnection(uri, connectionOptions, function(err) {
          if (err) {
            return logger.error(err);
          } else {
            return logger.info(uri);
          }
        });
        dataBaseHandler.setDBInfo({
          uri: uri,
          conn: conn,
          alias: alias
        });
        return conn;
      }
    },
    /**
     * [getConnection 返回数据库连接]
     * @param  {[type]} alias [数据库连接别名]
     * @return {[type]}       [description]
    */

    getConnection: function(alias) {
      return dataBaseHandler.getConnection(alias);
    },
    /**
     * [model 获取或设置数据库model]
     * @param  {[type]} alias    [数据库连接别名]
     * @param  {[type]} name     [model名字]
     * @param  {[type]} modelObj [model的参数实例（若无该参数则是获取）]
     * @return {[type]}          [description]
    */

    model: function(alias, name, modelObj) {
      var args;
      args = _.toArray(arguments);
      return dataBaseHandler.model.apply(dataBaseHandler, args);
    },
    /**
     * [find 查询方法]
     * @param  {[type]} alias   [数据库连接别名]
     * @param  {[type]} name    [model名字]
     * @param  {[type]} conditions [查询条件]
     * @param  {[type]} fields [optional][查询返回字段]
     * @param  {[type]} options [optional][]
     * @param  {[type]} cbf     [回调函数]
     * @return {[type]}         [description]
    */

    find: function(alias, name, conditions, fields, options, cbf) {
      var args;
      args = _.toArray(arguments);
      args.push(wrapMongooseCallback('toObject', args.pop()));
      return dataBaseHandler.find.apply(dataBaseHandler, args);
    },
    /**
     * [findById 通过id查找对象]
     * @param  {[type]} alias   [数据库连接别名]
     * @param  {[type]} name    [model名字]
     * @param  {[type]} id [对象id]
     * @param  {[type]} fields [optional][查询返回字段]
     * @param  {[type]} options [optional][]
     * @param  {[type]} cbf     [回调函数]
     * @return {[type]}         [description]
    */

    findById: function(alias, name, id, fields, options, cbf) {
      var args;
      args = _.toArray(arguments);
      args.push(wrapMongooseCallback('toObject', args.pop()));
      return dataBaseHandler.findById.apply(dataBaseHandler, args);
    },
    /**
     * [findByIdAndUpdate 通过id查找对象并修改]
     * @param  {[type]} alias   [数据库连接别名]
     * @param  {[type]} name    [model名字]
     * @param  {[type]} id      [对象id]
     * @param  {[type]} update  [更新的数据]
     * @param  {[type]} options [一些更新配置信息]
     * @param  {[type]} cbf     [回调函数]
     * @return {[type]}         [description]
    */

    findByIdAndUpdate: function(alias, name, id, update, options, cbf) {
      var args;
      args = _.toArray(arguments);
      return dataBaseHandler.findByIdAndUpdate.apply(dataBaseHandler, args);
    },
    /**
     * [findOne 查找符合条件的一个数据]
     * @param  {[type]} alias   [数据库连接别名]
     * @param  {[type]} name    [model名字]
     * @param  {[type]} conditions [查询条件]
     * @param  {[type]} fields [optional][查询返回字段]
     * @param  {[type]} options [optional][]
     * @param  {[type]} cbf     [回调函数]
     * @return {[type]}         [description]
    */

    findOne: function(alias, name, conditions, fields, options, cbf) {
      var args;
      args = _.toArray(arguments);
      args.push(wrapMongooseCallback('toObject', args.pop()));
      return dataBaseHandler.findOne.apply(dataBaseHandler, args);
    },
    /**
     * [findOneAndUpdate 查找一个数据并更新]
     * @param  {[type]} alias      [数据库连接别名]
     * @param  {[type]} name       [model名字]
     * @param  {[type]} conditions [查询条件]
     * @param  {[type]} update     [更新的数据]
     * @param  {[type]} options    [一些更新配置信息]
     * @param  {[type]} cbf        [回调函数]
     * @return {[type]}            [description]
    */

    findOneAndUpdate: function(alias, name, conditions, update, options, cbf) {
      var args;
      args = _.toArray(arguments);
      return dataBaseHandler.findOneAndUpdate.apply(dataBaseHandler, args);
    },
    /**
     * [count 返回符合查询条件的总数]
     * @param  {[type]} alias      [数据库连接别名]
     * @param  {[type]} name       [model名字]
     * @param  {[type]} conditions [查询条件]
     * @param  {[type]} cbf        [回调函数]
     * @return {[type]}            [description]
    */

    count: function(alias, name, conditions, cbf) {
      var args;
      args = _.toArray(arguments);
      return dataBaseHandler.count.apply(dataBaseHandler, args);
    },
    /**
     * [save 保存对象]
     * @param  {[type]} alias [数据库连接别名]
     * @param  {[type]} name  [model名字]
     * @param  {[type]} data  [对象]
     * @param  {[type]} cbf   [回调函数]
     * @return {[type]}       [description]
    */

    save: function(alias, name, data, cbf) {
      var args;
      args = _.toArray(arguments);
      return dataBaseHandler.save.apply(dataBaseHandler, args);
    },
    removeById: function(alias, name, id, cbf) {
      var args;
      args = _.toArray(arguments);
      return dataBaseHandler.removeById.apply(dataBaseHandler, args);
    }
  };

  dataBaseHandler = {
    /**
     * [dbInfos 保存每个数据库的一些信息（uri，初始化后的connnection，alias，model列表）]
     * @type {Object}
    */

    dbInfos: {},
    /**
     * [getConnection 返回数据库连接]
     * @param  {[type]} alias [数据库连接别名]
     * @return {[type]}       [description]
    */

    getConnection: function(alias) {
      var dbInfo, self;
      self = this;
      dbInfo = self.getDBInfo(alias);
      if (dbInfo) {
        return dbInfo.conn;
      } else {
        return null;
      }
    },
    /**
     * [getDBInfo 返回数据库信息]
     * @param  {[type]} alias [数据库连接别名]
     * @return {[type]}       [description]
    */

    getDBInfo: function(alias) {
      return this.dbInfos[alias];
    },
    /**
     * [setDBInfo 设置数据库信息]
     * @param {[type]} info [保存每个数据库的一些信息（uri，初始化后的connnection，alias，model列表]
    */

    setDBInfo: function(info) {
      var alias, defaults;
      defaults = {
        uri: '',
        conn: '',
        alias: '',
        models: {}
      };
      alias = info.alias;
      if (_.isString(alias) && alias.length > 0) {
        return this.dbInfos[info.alias] = _.extend(defaults, info);
      }
    },
    /**
     * [model 获取或设置数据库model]
     * @param  {[type]} alias    [数据库连接别名]
     * @param  {[type]} name     [model名字]
     * @param  {[type]} modelObj [model的参数实例（若无该参数则是获取）]
     * @return {[type]}          [description]
    */

    model: function(alias, name, modelObj) {
      var conn, dbInfo, model, models, schema, self;
      self = this;
      dbInfo = self.getDBInfo(alias);
      models = dbInfo.models;
      conn = dbInfo.conn;
      if (modelObj) {
        if (conn) {
          schema = new Schema(modelObj);
          model = conn.model(name, schema);
          return models[name] = model;
        }
      } else {
        return models[name];
      }
    },
    /**
     * [save 保存对象]
     * @param  {[type]} alias [数据库连接别名]
     * @param  {[type]} name  [model名字]
     * @param  {[type]} data  [对象]
     * @param  {[type]} cbf   [回调函数]
     * @return {[type]}       [description]
    */

    save: function(alias, name, data, cbf) {
      var model, self;
      self = this;
      model = self.model(alias, name);
      return new model(data).save(cbf);
    },
    removeById: function(alias, name, id, cbf) {
      return null;
    },
    /**
     * [count 返回符合查询条件的总数]
     * @param  {[type]} alias      [数据库连接别名]
     * @param  {[type]} name       [model名字]
     * @param  {[type]} conditions [查询条件]
     * @param  {[type]} cbf        [回调函数]
     * @return {[type]}            [description]
    */

    count: function(alias, name, conditions, cbf) {
      var model, self;
      self = this;
      model = self.model(alias, name);
      return model.count(conditions, cbf);
    }
  };

  modelFunctions = 'find findById findByIdAndUpdate findOne findOneAndUpdate';

  _.each(modelFunctions.split(' '), function(func) {
    return dataBaseHandler[func] = function() {
      var args, self;
      self = this;
      args = _.toArray(arguments);
      args.unshift(self, func);
      return mongooseModel.apply(null, args);
    };
  });

  /**
   * [mongooseModel mongoose中model的一些方法]
   * @param  {[type]} dbHandler [description]
   * @param  {[type]} func      [description]
   * @param  {[type]} alias     [description]
   * @param  {[type]} name      [description]
   * @param  {[type]} args...   [description]
   * @return {[type]}           [description]
  */


  mongooseModel = function() {
    var alias, args, dbHandler, func, model, name;
    dbHandler = arguments[0], func = arguments[1], alias = arguments[2], name = arguments[3], args = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
    model = dbHandler.model(alias, name);
    if (!model) {
      return null;
    }
    return model[func].apply(model, args);
  };

  /**
   * [wrapMongooseCallback 包裹mongoose的callback函数，对callback作一些处理]
   * @param  {[type]} type [对callback处理的类型]
   * @param  {[type]} func [description]
   * @return {[type]}      [description]
  */


  wrapMongooseCallback = function(type, func) {
    switch (type) {
      case 'toObject':
        return transformDataToObject(func);
    }
  };

  /**
   * [transformDataToObject 将mongoose返回的数据转换为Obejct]
   * @param  {[type]} func [回调的函数]
   * @return {[type]}      [description]
  */


  transformDataToObject = function(func) {
    return function(err, data) {
      if (data && _.isFunction(data.toObject)) {
        data = data.toObject();
      }
      return func(err, data);
    };
  };

  module.exports = mongoClient;

}).call(this);