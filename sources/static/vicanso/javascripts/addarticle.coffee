jQuery ($) ->
  $('#editorControlerContainer').on 'click', '.add', () ->
    inputTypeList = 
      '标题' : 'title'
      '内容' : 'p'
      '代码' : 'code'
    inputType = $('#editorControlerContainer .inputType').val()
    inputType = inputTypeList[inputType] || 'p'
    $("<p>#{inputType}</p>").appendTo '#editorContainer'
    $("<textarea inputType=#{inputType} />").appendTo '#editorContainer'
  $('#editorControlerContainer').on 'click', '.submit', () ->
    submitData =
      title : $('#editorContainer .title').val()
    content = []
    $('#editorContainer textarea').each () ->
      obj = $ @
      data = 
        tag : obj.attr 'inputType'
        data : obj.val()
      content.push data
    submitData.content = content
    $.ajax {
      url : '/vicanso/admin/addarticle'
      type : 'post'
      data : submitData
      success : (data) ->
        console.log data
    }
