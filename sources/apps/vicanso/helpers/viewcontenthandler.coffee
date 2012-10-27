_ =require 'underscore'
config = require '../../../config'
appPath = config.getAppPath()
webConfig = require "#{appPath}/apps/vicanso/helpers/webconfig"
baseConfig = require "#{appPath}/helpers/baseconfig"
viewDataHandler = require "#{appPath}/apps/vicanso/helpers/viewdatahandler"
logger = require("#{appPath}/helpers/logger") __filename
myUtil = require "#{appPath}/helpers/util"

viewContentHandler = 
  index : (req, res, cbf) ->
    viewDataHandler.index (err, data) ->
      if err
        logger.error err
      else
        # 推荐文章内容的截取
        recommendArticles = data.recommendArticles
        _.each recommendArticles, (recommendArticle) ->
          recommendArticle.desc = myUtil.cutStringByViewSize recommendArticle.content[0].data, 50
          delete recommendArticle.content
        # 我的文章截取
        articles = data.articles
        _.each articles, (article) ->
          article.content = article.content.slice 0, 5
        viewData = 
          title : '每天再往前一点！'
          viewContent : 
            header : webConfig.getHeader 0
            articles : articles
            reflection : data.reflection
            nodeModules : data.nodeModules
            recommendArticles : recommendArticles
          baseConfig :
            baseDialog : baseConfig.getDialog()
            baseButtonSet : baseConfig.getButtonSet()
      cbf viewData
  article : (req, res, cbf) ->
    id = req.param 'id'
    if !id
      logger.error 'article id is required'
      cbf null
    else
      viewDataHandler.article id, (err, data) ->
        viewData =
          title : '每天再浏览多一点！'
          viewContent : 
            header : webConfig.getHeader -1
            article : data
          baseConfig : 
            baseDialog : baseConfig.getDialog()
        cbf viewData
  addArticle : (req, res, cbf) ->
    if req.xhr
      viewDataHandler.addArticle req.body, (err) ->
        if err
          res.send err
        else
          res.send 'success'
    else
      viewData =
        title : '添加新的文章'
        viewContent : 
          header : webConfig.getHeader -1
      cbf viewData  
  login : (req, res, cbf) ->
    if req.xhr
      console.log req.body
      res.send 'success'
    else 
      viewData = 
        title : '登录界面'
      cbf viewData
  updateNodeModules : (res) ->
    viewDataHandler.updateNodeModules () ->
      res.send 'success'
module.exports = viewContentHandler
