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
    rootPath = '/qz'
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
      name : '首页'
      href : '/vicanso'
      alias : 'index'
    }
    {
      name : '衣服'
      href : '#'
      alias : 'frontEnd'
    }
    {
      name : '鞋子'
      href : '#'
      alias : 'myNode'
    }
    {
      name : '包包'
      href : '#'
      alias : 'myArticles'
    }
    {
      name : '配饰'
      href : '#'
      alias : 'myTools'
    }
    {
      name : '美容'
      href : '#'
      alias : 'base'
    }
    {
      name : '潮男'
      href : '#'
      alias : 'aboutMe'
    }
  ]

module.exports[key] = func for key, func of webConfig
