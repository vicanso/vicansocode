(function() {

  jQuery(function() {
    $('#rightContainer .modityTags').on('click', '.tag', function() {
      var obj;
      obj = $(this);
      return obj.toggleClass('selected');
    });
    return $('#saveModify').click(function() {
      var commodityContainer, commodityData, picUrl, saveBtn, tags;
      saveBtn = $(this);
      commodityContainer = $('.commodityContainer');
      tags = $('.modityTags .tag.selected').map(function() {
        var obj;
        obj = $(this);
        return obj.text();
      }).get();
      commodityData = {
        title: commodityContainer.find('.commodityTitle').val(),
        url: commodityContainer.find('.commodityUrl').val(),
        desc: commodityContainer.find('.commodityDesc').val(),
        tags: tags
      };
      picUrl = commodityContainer.find('.imgSrc').val() || commodityContainer.find('.commodityArchor img').attr('src');
      if (picUrl) {
        commodityData.pics = [
          {
            url: picUrl,
            area: {
              height: 400,
              width: 400
            }
          }
        ];
      }
      commodityData = $.extend({}, COMMODITY, commodityData);
      saveBtn.text('保存中...');
      return $.ajax({
        url: "/ys/action/savecommodity",
        type: 'post',
        data: commodityData,
        dataType: 'json',
        success: function() {
          console.log('success');
          return saveBtn.text('修改成功');
        },
        error: function() {
          return alert('error');
        }
      });
    });
  });

}).call(this);
