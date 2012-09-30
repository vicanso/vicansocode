(function() {
  var base, getBaseWidgetConfig, _;

  _ = require('underscore');

  base = {
    dialog: {
      selfClass: 'uiDialog uiWidget uiBlackBorder uiCornerAll uiBlackBoxShadow',
      titleBarClass: 'uiTitleBar uiBlackGradientBG uiCornerAll',
      contentClass: 'uiContent'
    },
    list: {
      selfClass: 'uiList uiWidget uiBlackBorder uiCornerAll uiBlackBoxShadow',
      titleBarClass: 'uiListTitleBar uiNoSelectText uiBlackGradientBG',
      contentClass: 'uiListContent',
      listItemClass: 'uiListItem'
    },
    buttonSet: {
      selfClass: 'uiButtonSet uiWidget uiNoSelectText uiBlackBoxShadow uiCornerAll uiBlackBorder',
      buttonClass: 'uiButton uiBlackGradientBG'
    }
  };

  /**
   * [getBaseWidgetConfig description]
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

  module.exports = {
    getDialogConfig: function(options) {
      return getBaseWidgetConfig('dialog', options);
    },
    getListConfig: function(options) {
      return getBaseWidgetConfig('list', options);
    }
  };

}).call(this);