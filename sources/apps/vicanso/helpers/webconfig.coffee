_ = require 'underscore'

webConfig = 
  ###*
   * [getHeader 返回header的数据]
   * @param  {[type]} selectedIndex [选中头部导航的index]
   * @return {[type]}               [description]
  ###
  getHeader : (selectedIndex) ->
    selectedIndex = selectedIndex || 0
    headerInfo = 
      nav : getNav()
      selectedIndex : selectedIndex
    return headerInfo
  ###*
   * [getConfig 返回网页的相关信息配置]
   * @return {[type]} [description]
  ###
  getConfig : () ->
    rootPath = '/vicanso'
    paths = {}
    _.each getNav(), (nav) ->
      paths[nav.alias] = nav.href
    config = 
      ajaxPath : "#{rootPath}/ajax"
      paths : paths
    return config


getNav = () ->
  return [
    {
      name : '主页'
      href : '/vicanso'
      alias : 'index'
    }
    {
      name : '我的前端'
      href : '#'
      alias : 'frontEnd'
    }
    {
      name : '我的NODE'
      href : '#'
      alias : 'myNode'
    }
    {
      name : '文章分享'
      href : '#'
      alias : 'myArticles'
    }
    {
      name : '工具推荐'
      href : '#'
      alias : 'myTools'
    }
    {
      name : 'BASE UI'
      href : '#'
      alias : 'base'
    }
    {
      name : '关于我'
      href : '#'
      alias : 'aboutMe'
    }
  ]

module.exports[key] = func for key, func of webConfig
