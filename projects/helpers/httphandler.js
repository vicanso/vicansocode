(function() {
  var appPath, appendJsAndCss, config, httpHandler, logger;

  config = require('../config');

  appPath = config.getAppPath();

  logger = require("" + appPath + "/helpers/logger")(__filename);

  httpHandler = {
    /**
     * [处理模板]
     * @param  {[type]} req  [request]
     * @param  {[type]} res  [respone]
     * @param  {[type]} view [模板路径]
     * @param  {[type]} data [模板中使用到的一些数据]
     * @param  {[type]} ttl  [缓存的时间（可选），若带该参数则将HTML缓存到redis中]
     * @return {[type]}      [description]
    */

    render: function(req, res, view, data, ttl) {
      var fileImporter;
      fileImporter = data.fileImporter;
      return res.render(view, data, function(err, html) {
        if (err) {
          logger.error(err);
        }
        html = appendJsAndCss(html, fileImporter);
        return res.send(html);
      });
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
    html = html.replace('<!--JS_FILES_CONTAINER-->', fileImporter.exportJs());
    return html;
  };

  module.exports = httpHandler;

}).call(this);
