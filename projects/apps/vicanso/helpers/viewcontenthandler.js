(function() {
  var appPath, baseConfig, config, logger, myUtil, viewContentHandler, viewDataHandler, webConfig, _;

  _ = require('underscore');

  config = require('../../../config');

  appPath = config.getAppPath();

  webConfig = require("" + appPath + "/apps/vicanso/helpers/webconfig");

  baseConfig = require("" + appPath + "/helpers/baseconfig");

  viewDataHandler = require("" + appPath + "/apps/vicanso/helpers/viewdatahandler");

  logger = require("" + appPath + "/helpers/logger")(__filename);

  myUtil = require("" + appPath + "/helpers/util");

  viewContentHandler = {
    index: function(req, res, cbf) {
      return viewDataHandler.index(function(err, data) {
        var articles, recommendArticles, viewData;
        if (err) {
          logger.error(err);
        } else {
          recommendArticles = data.recommendArticles;
          _.each(recommendArticles, function(recommendArticle) {
            recommendArticle.desc = myUtil.cutStringByViewSize(recommendArticle.content[0].data, 50);
            return delete recommendArticle.content;
          });
          articles = data.articles;
          _.each(articles, function(article) {
            return article.content = article.content.slice(0, 5);
          });
          viewData = {
            title: '每天再往前一点！',
            viewContent: {
              header: webConfig.getHeader(0),
              articles: articles,
              reflection: data.reflection,
              nodeModules: data.nodeModules,
              recommendArticles: recommendArticles
            },
            baseConfig: {
              baseDialog: baseConfig.getDialog(),
              baseButtonSet: baseConfig.getButtonSet()
            }
          };
        }
        return cbf(viewData);
      });
    },
    article: function(req, res, cbf) {
      var behaviorData, id;
      id = req.param('id');
      if (!id) {
        logger.error('article id is required');
        return cbf(null);
      } else {
        behaviorData = {
          targetId: id,
          behavior: 'view'
        };
        return viewDataHandler.article(id, behaviorData, function(err, data) {
          var viewData;
          viewData = {
            title: '每天再浏览多一点！',
            viewContent: {
              header: webConfig.getHeader(-1),
              article: data
            },
            baseConfig: {
              baseDialog: baseConfig.getDialog()
            }
          };
          return cbf(viewData);
        });
      }
    },
    addArticle: function(req, res, cbf) {
      var viewData;
      if (req.xhr) {
        viewDataHandler.addArticle(req.body, function(err) {
          var viewData;
          if (err) {
            return viewData = {
              code: 1000,
              msg: err.toString()
            };
          } else {
            return viewData = {
              code: 0,
              msg: 'success'
            };
          }
        });
      } else {
        viewData = {
          title: '添加新的文章',
          viewContent: {
            header: webConfig.getHeader(-1)
          }
        };
      }
      return cbf(viewData);
    },
    login: function(req, res, cbf) {
      var sess, viewData;
      if (req.xhr) {
        viewData = {
          code: 0,
          msg: 'success'
        };
        sess = req.session;
        sess.nick = req.body.user;
      } else {
        viewData = {
          title: '登录界面'
        };
      }
      return cbf(viewData);
    },
    getNoCacheInfo: function(req, res, cbf) {
      var jsonStr, sess, userInfo;
      sess = req.session;
      userInfo = {
        nick: sess.nick || '匿名用户'
      };
      config = webConfig.getConfig();
      jsonStr = '';
      jsonStr += "var USER_INFO=" + (JSON.stringify(userInfo)) + ";";
      jsonStr += "var WEB_CONFIG=" + (JSON.stringify(config)) + ";";
      return cbf(jsonStr);
    },
    userBehavior: function(req, res, cbf) {
      return viewDataHandler.userBehavior(req.params, function(err) {
        if (err) {
          return cbf({
            code: 1000,
            msg: err.toString()
          });
        } else {
          return cbf({
            code: 0,
            msg: 'success'
          });
        }
      });
    },
    updateNodeModules: function(res) {
      return viewDataHandler.updateNodeModules(function() {
        return res.send('success');
      });
    }
  };

  module.exports = viewContentHandler;

}).call(this);
