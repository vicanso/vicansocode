
webConfig = 
  ###*
   * [getHeader 返回header的数据]
   * @param  {[type]} selectedIndex [选中头部导航的index]
   * @return {[type]}               [description]
  ###
  getHeader : (selectedIndex) ->
    selectedIndex = selectedIndex || 0
    headerInfo = 
      nav : [
        {
          name : '主页'
          href : '#'
        }
        {
          name : '我的前端'
          href : '#'
        }
        {
          name : '文章分享'
          href : '#'
        }
        {
          name : '工具推荐'
          href : '#'
        }
        {
          name : 'BASE UI'
          href : '#'
        }
        {
          name : '联系我'
          href : '#'
        }
      ]
      selectedIndex : selectedIndex
    return headerInfo

module.exports = webConfig
