(function() {
  var webConfig;

  webConfig = {
    /**
     * [getHeader 返回header的数据]
     * @param  {[type]} selectedIndex [选中头部导航的index]
     * @return {[type]}               [description]
    */

    getHeader: function(selectedIndex) {
      var headerInfo;
      selectedIndex = selectedIndex || 0;
      headerInfo = {
        nav: [
          {
            name: '主页',
            href: '/ys'
          }
        ],
        selectedIndex: selectedIndex
      };
      return headerInfo;
    }
  };

  module.exports = webConfig;

}).call(this);
