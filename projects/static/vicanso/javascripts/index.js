(function() {

  jQuery(function($) {
    $.ajax({
      url: '/vicanso/ajax/test',
      success: function(data) {
        return console.log(data);
      }
    });
    $('#articlesContainer .codeContainer textarea').each(function() {
      var editor;
      editor = CodeMirror.fromTextArea(this, {
        lineNumbers: true,
        matchBrackets: true
      });
      return editor.setOption('theme', 'monokai');
    });
    $('#articlesContainer .articleButtonSet').each(function() {
      return $(this).buttonSet();
    });
    $.storage.set('key', 'test', 10);
    return console.log($.storage.get('key'));
  });

}).call(this);
