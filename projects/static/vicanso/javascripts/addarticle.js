(function() {

  jQuery(function($) {
    $('#editorControlerContainer').on('click', '.add', function() {
      var inputType, inputTypeList;
      inputTypeList = {
        '标题': 'title',
        '内容': 'p',
        '代码': 'code'
      };
      inputType = $('#editorControlerContainer .inputType').val();
      inputType = inputTypeList[inputType] || 'p';
      $("<p>" + inputType + "</p>").appendTo('#editorContainer');
      return $("<textarea inputType=" + inputType + " />").appendTo('#editorContainer');
    });
    return $('#editorControlerContainer').on('click', '.submit', function() {
      var content, submitData;
      submitData = {
        title: $('#editorContainer .title').val()
      };
      content = [];
      $('#editorContainer textarea').each(function() {
        var data, obj;
        obj = $(this);
        data = {
          tag: obj.attr('inputType'),
          data: obj.val()
        };
        return content.push(data);
      });
      submitData.content = content;
      return $.ajax({
        url: '/vicanso/admin/addarticle',
        type: 'post',
        data: submitData,
        success: function(data) {
          return console.log(data);
        }
      });
    });
  });

}).call(this);
