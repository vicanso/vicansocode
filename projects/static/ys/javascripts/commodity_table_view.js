(function() {

  jQuery(function() {
    return $('#contentContainer').flexigrid({
      url: '/ys/table',
      dataType: 'json',
      height: 500,
      colModel: [
        {
          display: '条形码',
          name: 'barcode',
          width: 120,
          sortable: true,
          align: 'center'
        }, {
          display: '商品名',
          name: 'title',
          width: 250,
          align: 'center'
        }, {
          display: '规格',
          name: 'specification',
          width: 120,
          align: 'center'
        }
      ]
    });
  });

}).call(this);
