jQuery ($) ->
  $.ajax {
    url : '/vicanso/ajax/test'
    success : (data) ->
      console.log data
  }

  $('#articlesContainer .codeContainer textarea').each () ->
    editor = CodeMirror.fromTextArea @, {
      lineNumbers : true
      matchBrackets : true
    }
    editor.setOption 'theme', 'monokai'

  $('#articlesContainer .articleButtonSet').each () ->
    $(@).buttonSet()


  $.storage.set 'key', 'test', 10
  console.log $.storage.get 'key'