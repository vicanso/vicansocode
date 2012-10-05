jQuery () ->
  # 商品名的移动上去时显示的功能
  $('#contentContainer .waterfallContainer .elementContainer .commodityContainer .commodityArchor').hover () ->
    obj = $ @
    $('.commodityTitle', obj).stop(true, true).animate {bottom : 0}, 300
  , () ->
    obj = $ @
    $('.commodityTitle', obj).stop(true, true).animate {bottom : -30}, 300

  # 标签选择
  $('#commodityFilterContainer .filterList').on 'click', '.tagItem .tag', () ->
    obj = $ @
    tag = obj.text()
    if tag

      url = getUrl {
        tag : tag
        page : 1
      }
      window.location.href = encodeURI url

  # 翻页
  $('#contentContainer .uiButtonSet').on 'click', '.uiButton', () ->
    obj = $ @
    page = window.parseInt obj.text()
    if !isNaN page
      url = getUrl {
        page : page
      }
      window.location.href = encodeURI url

  getUrl = (query) ->
    query = query || {}
    segs = $.url().segment()
    urlQuery = ''

    getQuery = (tag, segs, query) ->
      index = $.inArray tag, segs
      if query[tag]
        return "/#{tag}/#{query[tag]}"
      else if index isnt -1
        return "/#{tag}/#{segs[index + 1]}"
      else
        return ''
    urlQuery += getQuery 'tag', segs, query
    urlQuery += getQuery 'page', segs, query
    return INFO.paths.home + urlQuery


