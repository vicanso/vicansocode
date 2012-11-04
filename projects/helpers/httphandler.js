
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var appPath, appendJsAndCss, config, errorResponse, httpHandler, logger, myUtil, response;

  config = require('../config');

  appPath = config.getAppPath();

  myUtil = require("" + appPath + "/helpers/util");

  logger = require("" + appPath + "/helpers/logger")(__filename);

  httpHandler = {
    /**
     * [处理模板]
     * @param  {[type]} req  [request]
     * @param  {[type]} res  [respone]
     * @param  {[type]} view [模板路径]
     * @param  {[type]} data [模板中使用到的一些数据]
     * @return {[type]}      [description]
    */

    render: function(req, res, view, data) {
      var fileImporter;
      if (data) {
        fileImporter = data.fileImporter;
        return res.render(view, data, function(err, html) {
          if (err || !html) {
            logger.error(err);
            return;
          }
          html = appendJsAndCss(html, fileImporter);
          return response(req, res, html);
        });
      } else {
        return errorResponse(res);
      }
    }
  };

  /**
   * [appendJsAndCss 往HTML中插入js,css引入列表]
   * @param  {[type]} html         [html内容（未包含通过FileImporter引入的js,css）]
   * @param  {[type]} fileImporter [FileImporter实例]
   * @return {[type]}              [description]
  */


  appendJsAndCss = function(html, fileImporter) {
    html = html.replace('<!--CSS_FILES_CONTAINER-->', fileImporter.exportCss(true));
    html = html.replace('<!--JS_FILES_CONTAINER-->', fileImporter.exportJs(true));
    return html;
  };

  /**
   * [response 响应HTTP请求，若浏览器支持gzip，则将数据以gzip的形式返回]
   * @param  {[type]} req  [description]
   * @param  {[type]} res  [description]
   * @param  {[type]} html [description]
   * @return {[type]}      [description]
  */


  response = function(req, res, html) {
    var acceptEncoding, zipFunc;
    acceptEncoding = req.header('accept-encoding');
    res.header('Content-Type', 'text/html');
    res.header('Cache-Control', 'public, max-age=300');
    res.header('Last-Modified', new Date());
    if (acceptEncoding) {
      if (acceptEncoding.indexOf('gzip' !== -1)) {
        zipFunc = 'gzip';
      } else if (acceptEncoding.indexOf('deflate' !== -1)) {
        zipFunc = 'deflate';
      }
      if (zipFunc) {
        return myUtil[zipFunc](html, function(err, gzipData) {
          if (err) {
            logger.error(err);
            return res.send(html);
          } else {
            res.header('Content-Encoding', zipFunc);
            return res.send(gzipData);
          }
        });
      } else {
        return res.send(html);
      }
    } else {
      return res.send(html);
    }
  };

  errorResponse = function(res) {
    return res.send(500, 'server error');
  };

  module.exports = httpHandler;

}).call(this);
