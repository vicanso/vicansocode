(function() {

  jQuery(function($) {
    return $('#articleContainer .codeContainer textarea').each(function() {
      var editor;
      editor = CodeMirror.fromTextArea(this, {
        lineNumbers: true,
        matchBrackets: true
      });
      return editor.setOption('theme', 'monokai');
    });
  });

}).call(this);
