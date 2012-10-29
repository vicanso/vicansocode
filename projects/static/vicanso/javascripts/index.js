(function() {

  jQuery(function($) {
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
    return $('#articlesContainer .articleButtonSet').on('click', '.recommend', function() {
      var articleContainer, id, obj;
      obj = $(this);
      articleContainer = obj.closest('.articleContainer');
      id = articleContainer.attr('data-id');
      if (id) {
        return $.ajax({
          url: "" + WEB_CONFIG.ajaxPath + "/userbehavior/like/" + id,
          success: function(data) {
            return console.log(data);
          },
          error: function() {}
        });
      }
    });
  });

}).call(this);
