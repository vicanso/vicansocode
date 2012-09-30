(function() {
  var appPath, client, config, dbAlias, init, logger, mongoClient, schemas, test, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  client = require("" + appPath + "/models/mongoclient");

  logger = require("" + appPath + "/helpers/logger")(__filename);

  schemas = require("" + appPath + "/apps/vicanso/models/schemas");

  dbAlias = 'vicanso';

  init = function(client, dbAlias) {
    var mongoClient, uri;
    mongoClient = {};
    _.each(_.functions(client), function(func) {
      return mongoClient[func] = function() {
        var args;
        if (!_.isFunction(client[func])) {
          return logger.error("call mongoClient function: " + func + " is not defined");
        } else {
          args = _.toArray(arguments);
          args.unshift(dbAlias);
          return client[func].apply(client, args);
        }
      };
    });
    uri = "mongodb://vicanso:86545610@127.0.0.1:10020/vicanso";
    mongoClient.createConnection(uri);
    _.each(schemas, function(model, name) {
      return mongoClient.model(name, model);
    });
    return mongoClient;
  };

  mongoClient = init(client, dbAlias);

  mongoClient.find('Article', {}, function(err, data) {
    return logger.info("Article total:" + data.length);
  });

  mongoClient.count('Article', {}, function(err, count) {
    return logger.info("Article count total:" + count);
  });

  console.time('find');

  mongoClient.findOne('Test', {
    title: 'title_50000'
  }, function(err, data) {
    return console.timeEnd('find');
  });

  console.time('findById');

  mongoClient.findById('Test', '5066ca9d65598aab0900c352', function(err, data) {
    return console.timeEnd('findById');
  });

  mongoClient.save('Article', {
    title: '测试保存',
    content: []
  }, function(err) {
    return logger.info("success: " + err);
  });

  mongoClient.findById('Article', '50115cece02d18bb46000002', function(err, data) {
    return logger.info("Article 50115cece02d18bb46000002:" + data);
  });

  test = function() {
    var id, obj;
    id = _.uniqueId();
    obj = {
      title: 'title_' + id,
      content: _.range(10),
      userId: id
    };
    obj.content.push('大家可以多点去看一下事件绑定的回调函数的参数event对象，里面有很多有用的属性，特别是event.target，它是指向最开始触发事件的节点。顺带提一下，.live方法在最新的API中是Deprecated状态的，.delegate方法倒是没有（它的实现原理和.live差不多，只不过它并不把事件都放在document才处理而已），而在jQuery1.7版本增加.on方法则更加强大，可以替代.bind, .delegate，建议大家尽量使用它。大家可以多点去看一下事件绑定的回调函数的参数event对象，里面有很多有用的属性，特别是event.target，它是指向最开始触发事件的节点。顺带提一下，.live方法在最新的API中是Deprecated状态的，.delegate方法倒是没有（它的实现原理和.live差不多，只不过它并不把事件都放在document才处理而已），而在jQuery1.7版本增加.on方法则更加强大，可以替代.bind, .delegate，建议大家尽量使用它');
    return obj;
  };

}).call(this);