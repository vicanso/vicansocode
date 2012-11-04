jQuery ($) ->
  $('#articlesContainer .codeContainer textarea').each () ->
    editor = CodeMirror.fromTextArea @, {
      lineNumbers : true
      matchBrackets : true
    }
    editor.setOption 'theme', 'monokai'

  $('#articlesContainer .articleButtonSet').each () ->
    $(@).buttonSet {
      buttonClass : 'uiThemeGradientBG'
    }

  $('#articlesContainer .articleButtonSet').on 'click', '.recommend', () ->
    obj = $ @
    articleContainer = obj.closest '.articleContainer'
    id = articleContainer.attr 'data-id'
    if id
      $.ajax {
        url : "#{WEB_CONFIG.ajaxPath}/userbehavior/like/#{id}"
        success : (data) ->
          console.log data
        error : () ->

      }

  # $.storage.set 'key', 'test', 10
  # console.log $.storage.get 'key'