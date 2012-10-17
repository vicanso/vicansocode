jQuery ($) ->
  $('#articleContainer .codeContainer textarea').each () ->
    editor = CodeMirror.fromTextArea @, {
      lineNumbers : true
      matchBrackets : true
    }
    editor.setOption 'theme', 'monokai'
