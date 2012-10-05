jQuery () ->
  $('#rightContainer .modityTags').on 'click', '.tag', () ->
    obj = $ @
    obj.toggleClass 'selected'

  $('#saveModify').click () ->
    saveBtn = $ @
    commodityContainer = $ '.commodityContainer'

    tags = $('.modityTags .tag.selected').map(() ->
      obj = $ @
      return obj.text()
    ).get()
    
    commodityData = 
      title : commodityContainer.find('.commodityTitle').val()
      url : commodityContainer.find('.commodityUrl').val()
      desc : commodityContainer.find('.commodityDesc').val()
      tags : tags


    picUrl = commodityContainer.find('.imgSrc').val() || commodityContainer.find('.commodityArchor img').attr 'src'
    if picUrl
      commodityData.pics = [
        {
          url : picUrl
          area : 
            height : 400
            width : 400
        }
      ]
    commodityData = $.extend {}, COMMODITY, commodityData
    saveBtn.text '保存中...'
    $.ajax {
      url : "/ys/action/savecommodity"
      type : 'post'
      data : commodityData
      dataType : 'json'
      success : () ->
        console.log 'success'
        saveBtn.text '修改成功'
      error : () ->
        alert 'error'
    }
