(function() {
  var WaterFalls, appPath, baseConfig, config, getButtonSetConfig, getComodityTags, myUtil, viewContentHandler, webConfig, _;

  config = require('../../../config');

  appPath = config.getAppPath();

  _ = require('underscore');

  webConfig = require("" + appPath + "/apps/ys/helpers/webconfig");

  WaterFalls = require("" + appPath + "/helpers/waterfalls");

  baseConfig = require("" + appPath + "/helpers/baseconfig");

  myUtil = require("" + appPath + "/helpers/util");

  viewContentHandler = {
    home: function(fileImporter, commodities, pageConfig, selectedTag) {
      var itemFilter, pageButtonSetConfig, viewData, waterfalls;
      _.each(commodities, function(item) {
        var _ref, _ref1;
        item.type = 'commodity';
        item.picUrl = ((_ref = item.pics) != null ? (_ref1 = _ref[0]) != null ? _ref1.url : void 0 : void 0) || '';
        return item.cutDesc = myUtil.cutStringByViewSize(item.desc || item.title, 15 * 3);
      });
      waterfalls = new WaterFalls();
      itemFilter = {
        type: 'commodityFilter',
        tags: getComodityTags(),
        selectedTag: selectedTag
      };
      waterfalls.add(itemFilter, 0, 510);
      waterfalls.add(commodities);
      pageButtonSetConfig = getButtonSetConfig(pageConfig);
      viewData = {
        title: '每天浏览一下，关注更多的新产品！',
        fileImporter: fileImporter,
        viewContent: {
          header: webConfig.getHeader(0),
          waterfallsConfig: waterfalls.getConfig(true),
          pageButtonSetConfig: pageButtonSetConfig
        },
        baseConfig: {
          baseDialog: baseConfig.getDialogConfig()
        }
      };
      return viewData;
    },
    commodityModify: function(fileImporter, commodity) {
      var viewData;
      viewData = {
        title: '每天浏览一下，关注更多的新产品！',
        fileImporter: fileImporter,
        viewContent: {
          header: webConfig.getHeader(-1),
          commodity: commodity,
          allTags: getComodityTags()
        }
      };
      return viewData;
    }
  };

  getComodityTags = function() {
    var brands, categories, tags;
    brands = '箭牌 益达 劲浪 荷氏 维果C 曼妥思 阿尔卑斯 瑞士糖 百份百 趣满果 宝路 彩虹糖 雀巢 阿华田 桂格 立顿 元朗 金沙 好时 德芙 健逹 王老吉 波力 车仔 惠氏 美赞臣 多美滋 雅培 好立克 美禄 奥兰 能恩 子母 鹰唛 四洲 品客 百力滋 鹰牌 太古'.split(' ');
    categories = '口香糖 润喉糖 木糖醇 糖果 奶粉 麦片 咖啡 奶茶 茶 薯片 巧克力 威化 米粉 饮料 方糖'.split(' ');
    tags = [];
    _.each(brands, function(brand) {
      return tags.push({
        name: brand
      });
    });
    _.each(categories, function(category) {
      return tags.push({
        name: category
      });
    });
    return tags;
  };

  getButtonSetConfig = function(pageConfig) {
    var eachPageTotal, end, pageButtonSetConfig, start, total;
    start = pageConfig.currentPage || 1;
    eachPageTotal = pageConfig.eachPageTotal || 1;
    total = pageConfig.total || 1;
    end = Math.ceil(total / eachPageTotal);
    if (start === end) {
      return null;
    }
    pageButtonSetConfig = {
      start: start,
      end: end,
      total: 10
    };
    return pageButtonSetConfig;
  };

  module.exports = viewContentHandler;

}).call(this);
