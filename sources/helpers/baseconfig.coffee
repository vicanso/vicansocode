_ = require 'underscore'

base =
  dialog :
    selfClass : 'uiDialog uiWidget uiBlackBorder uiCornerAll uiBlackBoxShadow'
    titleBarClass : 'uiTitleBar uiBlackGradientBG uiCornerAll'
    contentClass : 'uiContent'
  list : 
    selfClass : 'uiList uiWidget uiBlackBorder uiCornerAll uiBlackBoxShadow'
    titleBarClass : 'uiListTitleBar uiNoSelectText uiBlackGradientBG'
    contentClass : 'uiListContent'
    listItemClass : 'uiListItem'
  buttonSet : 
    selfClass : 'uiButtonSet uiWidget uiNoSelectText uiBlackBoxShadow uiCornerAll uiBlackBorder'
    buttonClass : 'uiButton uiBlackGradientBG'
###*
 * [getBaseWidgetConfig description]
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
module.exports = 
  getDialogConfig : (options) ->
    return getBaseWidgetConfig 'dialog', options
  getListConfig : (options) ->
    return getBaseWidgetConfig 'list', options