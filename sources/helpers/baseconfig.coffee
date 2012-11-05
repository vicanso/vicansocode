###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

_ = require 'underscore'

base =
  dialog :
    selfClass : 'uiDialog uiWidget uiThemeBorder uiCornerAll uiThemeBoxShadow'
    titleBarClass : 'uiTitleBar uiThemeGradientBG uiCornerAll'
    contentClass : 'uiContent'
  list : 
    selfClass : 'uiList uiWidget uiThemeBorder uiCornerAll uiThemeBoxShadow'
    titleBarClass : 'uiListTitleBar uiNoSelectText uiThemeGradientBG'
    contentClass : 'uiListContent'
    listItemClass : 'uiListItem'
  buttonSet : 
    selfClass : 'uiButtonSet uiWidget uiNoSelectText uiThemeBoxShadow uiCornerAll uiThemeBorder'
    buttonClass : 'uiButton uiThemeGradientBG'
###*
 * [getBaseWidgetConfig 获取base UI中相关的一些配置信息]
 * @param  {[type]} type    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
###
getBaseWidgetConfig = (type, options) ->
  if type? && base[type]?
    widgetOpts = _.clone base[type]
    if _.isObject options
      _.each options, (value, key) ->
        if widgetOpts[key]? && _.isString widgetOpts[key]
          widgetOpts[key] = "#{widgetOpts[key]} #{value}".trim()
        else
          widgetOpts[key] = value
    return widgetOpts
  else
    return null

baseConfig = {}
_.each 'dialog buttonSet list'.split(' '), (widget) ->
  func = "get#{widget[0].toUpperCase()}#{widget.substring(1)}"
  baseConfig[func] = (options) ->
    return getBaseWidgetConfig widget, options
module.exports = baseConfig
  # getDialog : (options) ->
  #   return getBaseWidgetConfig 'dialog', options
  # getButtonSet : (options) ->
  #   return getBaseWidgetConfig 'buttonSet', options
  # getList : (options) ->
  #   return getBaseWidgetConfig 'list', options