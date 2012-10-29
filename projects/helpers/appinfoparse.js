
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appInfoParse, defaultAppInfo, parserList, _;

  _ = require('underscore');

  parserList = [];

  defaultAppInfo = {
    app: 'all'
  };

  appInfoParse = {
    /**
     * [handler 转换app信息的函数处理（会顺序的调用处理函数列表，如果某一函数有返回结果，则处理完成。否则，返回默认的配置信息）]
     * @return {[type]} [description]
    */

    handler: function() {
      return function(req, res, next) {
        var appInfo;
        appInfo = null;
        _.each(parserList, function(parse) {
          if (!appInfo) {
            appInfo = parse(req);
            return req.appInfo = appInfo;
          }
        });
        if (!appInfo) {
          appInfo = defaultAppInfo;
        }
        return next();
      };
    },
    /**
     * [getAppName 获取app的名字]
     * @param  {[type]} req [request对象]
     * @return {[type]}     [description]
    */

    getAppName: function(req) {
      var _ref;
      return (_ref = req.appInfo) != null ? _ref.app : void 0;
    },
    /**
     * [addParser 添加app信息的parser函数]
     * @param {[type]} func [description]
    */

    addParser: function(func) {
      if (_.isFunction(func)) {
        return parserList.push(func);
      }
    }
  };

  module.exports = appInfoParse;

}).call(this);
