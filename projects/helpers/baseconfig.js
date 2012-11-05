
/**!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
*/


(function() {
  var base, baseConfig, getBaseWidgetConfig, _;

  _ = require('underscore');

  base = {
    dialog: {
      selfClass: 'uiDialog uiWidget uiThemeBorder uiCornerAll uiThemeBoxShadow',
      titleBarClass: 'uiTitleBar uiThemeGradientBG uiCornerAll',
      contentClass: 'uiContent'
    },
    list: {
      selfClass: 'uiList uiWidget uiThemeBorder uiCornerAll uiThemeBoxShadow',
      titleBarClass: 'uiListTitleBar uiNoSelectText uiThemeGradientBG',
      contentClass: 'uiListContent',
      listItemClass: 'uiListItem'
    },
    buttonSet: {
      selfClass: 'uiButtonSet uiWidget uiNoSelectText uiThemeBoxShadow uiCornerAll uiThemeBorder',
      buttonClass: 'uiButton uiThemeGradientBG'
    }
  };

  /**
   * [getBaseWidgetConfig 获取base UI中相关的一些配置信息]
   * @param  {[type]} type    [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
  */


  getBaseWidgetConfig = function(type, options) {
    var widgetOpts;
    if ((type != null) && (base[type] != null)) {
      widgetOpts = _.clone(base[type]);
      if (_.isObject(options)) {
        _.each(options, function(value, key) {
          if ((widgetOpts[key] != null) && _.isString(widgetOpts[key])) {
            return widgetOpts[key] = ("" + widgetOpts[key] + " " + value).trim();
          } else {
            return widgetOpts[key] = value;
          }
        });
      }
      return widgetOpts;
    } else {
      return null;
    }
  };

  baseConfig = {};

  _.each('dialog buttonSet list'.split(' '), function(widget) {
    var func;
    func = "get" + (widget[0].toUpperCase()) + (widget.substring(1));
    return baseConfig[func] = function(options) {
      return getBaseWidgetConfig(widget, options);
    };
  });

  module.exports = baseConfig;

}).call(this);
