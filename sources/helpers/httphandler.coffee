###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

config = require "#{process._appPath}/config"
appPath = config.getAppPath()
myUtil = require "#{appPath}/helpers/util"
logger = require("#{appPath}/helpers/logger") __filename

httpHandler = 
  ###*
   * [处理模板]
   * @param  {[type]} req  [request]
   * @param  {[type]} res  [respone]
   * @param  {[type]} view [模板路径]
   * @param  {[type]} data [模板中使用到的一些数据]
   * @return {[type]}      [description]
  ###
  render : (req, res, view, data) ->
    if data
      fileImporter = data.fileImporter
      res.render view, data, (err, html) ->
        if err || !html
          logger.error err
          return 
        html = appendJsAndCss html, fileImporter
        if myUtil.resIsAvailable res
          response req, res, html
  json : (req, res, data) ->
    if myUtil.resIsAvailable res
      res.json data

###*
 * [appendJsAndCss 往HTML中插入js,css引入列表]
 * @param  {[type]} html         [html内容（未包含通过FileImporter引入的js,css）]
 * @param  {[type]} fileImporter [FileImporter实例]
 * @return {[type]}              [description]
###
appendJsAndCss = (html, fileImporter) ->
  html = html.replace '<!--CSS_FILES_CONTAINER-->', fileImporter.exportCss true
  html = html.replace '<!--JS_FILES_CONTAINER-->', fileImporter.exportJs true
  return html

###*
 * [response 响应HTTP请求，若浏览器支持gzip，则将数据以gzip的形式返回]
 * @param  {[type]} req  [description]
 * @param  {[type]} res  [description]
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
###
response = (req, res, html) ->
  acceptEncoding = req.header 'accept-encoding'
  res.header 'Content-Type', 'text/html'
  res.header 'Cache-Control', 'public, max-age=300'
  res.header 'Last-Modified', new Date()
  if acceptEncoding
    if acceptEncoding.indexOf 'gzip' != -1
      zipFunc = 'gzip'
    else if acceptEncoding.indexOf 'deflate' != -1
      zipFunc = 'deflate'
    if zipFunc
      myUtil[zipFunc] html, (err, gzipData) ->
        if err
          logger.error err
          res.send html
        else
          res.header 'Content-Encoding', zipFunc
          res.send gzipData
    else
      res.send html
  else
    res.send html

module.exports[key] = func for key, func of httpHandler
