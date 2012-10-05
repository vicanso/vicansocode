(function() {

  jQuery(function() {
    var getUrl;
    $('#contentContainer .waterfallContainer .elementContainer .commodityContainer .commodityArchor').hover(function() {
      var obj;
      obj = $(this);
      return $('.commodityTitle', obj).stop(true, true).animate({
        bottom: 0
      }, 300);
    }, function() {
      var obj;
      obj = $(this);
      return $('.commodityTitle', obj).stop(true, true).animate({
        bottom: -30
      }, 300);
    });
    $('#commodityFilterContainer .filterList').on('click', '.tagItem .tag', function() {
      var obj, tag, url;
      obj = $(this);
      tag = obj.text();
      if (tag) {
        url = getUrl({
          tag: tag,
          page: 1
        });
        return window.location.href = encodeURI(url);
      }
    });
    $('#contentContainer .uiButtonSet').on('click', '.uiButton', function() {
      var obj, page, url;
      obj = $(this);
      page = window.parseInt(obj.text());
      if (!isNaN(page)) {
        url = getUrl({
          page: page
        });
        return window.location.href = encodeURI(url);
      }
    });
    return getUrl = function(query) {
      var getQuery, segs, urlQuery;
      query = query || {};
      segs = $.url().segment();
      urlQuery = '';
      getQuery = function(tag, segs, query) {
        var index;
        index = $.inArray(tag, segs);
        if (query[tag]) {
          return "/" + tag + "/" + query[tag];
        } else if (index !== -1) {
          return "/" + tag + "/" + segs[index + 1];
        } else {
          return '';
        }
      };
      urlQuery += getQuery('tag', segs, query);
      urlQuery += getQuery('page', segs, query);
      return INFO.paths.home + urlQuery;
    };
  });

}).call(this);
