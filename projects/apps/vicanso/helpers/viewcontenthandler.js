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
      var id;
      id = req.param('id');
      if (!id) {
        logger.error('article id is required');
        return cbf(null);
      } else {
        return viewDataHandler.article(id, function(err, data) {
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
        return viewDataHandler.addArticle(req.body, function(err) {
          if (err) {
            return res.send(err);
          } else {
            return res.send('success');
          }
        });
      } else {
        viewData = {
          title: '添加新的文章',
          viewContent: {
            header: webConfig.getHeader(-1)
          }
        };
        return cbf(viewData);
      }
    },
    login: function(req, res, cbf) {
      var viewData;
      if (req.xhr) {
        console.log(req.body);
        return res.send('success');
      } else {
        viewData = {
          title: '登录界面'
        };
        return cbf(viewData);
      }
    },
    updateNodeModules: function(res) {
      return viewDataHandler.updateNodeModules(function() {
        return res.send('success');
      });
    }
  };

  module.exports = viewContentHandler;

}).call(this);
