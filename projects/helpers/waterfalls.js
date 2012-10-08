(function() {
  var Waterfalls, _;

  _ = require('underscore');

  Waterfalls = (function() {

    function Waterfalls(options) {
      var defaults;
      defaults = {
        column: 4,
        waterfallsDataList: [],
        waterfallsHeightList: [],
        defaultHeight: 236,
        defaultWidth: 236,
        defaultOffset: 55
      };
      this.opts = _.extend(defaults, options);
      this.init();
    }

    Waterfalls.prototype.init = function() {
      var column, i, opts, self, waterfallsDataList, waterfallsHeightList, _i;
      self = this;
      opts = self.opts;
      column = opts.column;
      waterfallsDataList = opts.waterfallsDataList;
      waterfallsHeightList = opts.waterfallsHeightList;
      for (i = _i = 0; 0 <= column ? _i < column : _i > column; i = 0 <= column ? ++_i : --_i) {
        waterfallsDataList.push([]);
        waterfallsHeightList.push(0);
      }
      return self;
    };

    Waterfalls.prototype.add = function(item, index, height) {
      var WaterfallsData, column, columnIndex, docs, opts, self, waterfallsDataList, waterfallsHeightList;
      self = this;
      opts = self.opts;
      column = opts.column;
      waterfallsDataList = opts.waterfallsDataList;
      waterfallsHeightList = opts.waterfallsHeightList;
      if (arguments.length === 0) {
        return self;
      }
      if (_.isArray(item)) {
        docs = item;
        _.each(docs, function(item, i) {
          var area, columnIndex, itemImageHeight, itemWidth, scale, _ref, _ref1;
          columnIndex = self.getMinHeightColumn();
          waterfallsDataList[columnIndex].push(item);
          area = (_ref = item.pics) != null ? (_ref1 = _ref[0]) != null ? _ref1.area : void 0 : void 0;
          if (area != null) {
            itemWidth = area.width || opts.defaultWidth;
            scale = opts.defaultWidth / itemWidth;
            itemImageHeight = (area.height || opts.defaultHeight) * scale;
          } else {
            itemImageHeight = opts.defaultHeight;
          }
          item.height = itemImageHeight + opts.defaultOffset;
          item.imageHeight = itemImageHeight;
          return waterfallsHeightList[columnIndex] += item.height;
        });
      } else {
        index = index || 0;
        height = height || opts.defaultHeight;
        columnIndex = index % column;
        WaterfallsData = waterfallsDataList[columnIndex];
        index = Math.floor(index / column);
        item.height = height;
        if (index === 0) {
          WaterfallsData.unshift(item);
        } else {
          WaterfallsData.splice(index, 0, item);
        }
        waterfallsHeightList[columnIndex] += height;
      }
      return self;
    };

    Waterfalls.prototype.getConfig = function(balance) {
      var opts, self;
      self = this;
      opts = self.opts;
      if (balance === true) {
        self.balanceColumnsHeight();
      }
      return {
        waterfallsWidth: opts.eachColumnWidth * opts.column,
        data: opts.waterfallsDataList
      };
    };

    Waterfalls.prototype.balanceColumnsHeight = function() {
      var column, itemHeight, maxColumnIndex, maxColumnItem, maxMinColumn, minColumnIndex, offsetHeight, opts, self, waterfallsDataList, waterfallsHeightList;
      self = this;
      opts = self.opts;
      column = opts.column;
      waterfallsDataList = opts.waterfallsDataList;
      waterfallsHeightList = opts.waterfallsHeightList;
      maxMinColumn = self.getMaxMinColumn();
      maxColumnIndex = maxMinColumn.max;
      minColumnIndex = maxMinColumn.min;
      offsetHeight = waterfallsHeightList[maxColumnIndex] - waterfallsHeightList[minColumnIndex];
      if (!_.isArray(waterfallsDataList[maxColumnIndex])) {
        return self;
      }
      maxColumnItem = waterfallsDataList[maxColumnIndex].pop();
      if (!maxColumnItem) {
        return self;
      }
      itemHeight = maxColumnItem.height;
      while (itemHeight < offsetHeight) {
        waterfallsDataList[minColumnIndex].push(maxColumnItem);
        waterfallsHeightList[maxColunmIndex] -= itemHeight;
        waterfallsHeightList[minColumnIndex] += itemHeight;
        maxMinColumn = self.getMaxMinColumn();
        maxColumnIndex = maxMinColumn.max;
        minColumnIndex = maxMinColumn.min;
        if (maxColumnIndex === -1) {
          return self;
        }
        offsetHeight = waterfallsHeightList[maxColumnIndex] - waterfallsHeightList[minColumnIndex];
        if (!_.isArray(waterfallsDataList[maxColumnIndex]) || waterfallsDataList[maxColumnIndex].length === 1) {
          return self;
        }
        maxColumnItem = waterfallsDataList[maxColumnIndex].pop();
        if (!maxColumnItem) {
          return self;
        }
        itemHeight = maxColumnItem.height;
      }
      waterfallsDataList[maxColumnIndex].push(maxColumnItem);
      return self;
    };

    Waterfalls.prototype.getMinHeightColumn = function() {
      return this.getMaxMinColumn()['min'];
    };

    Waterfalls.prototype.getMaxHeightColumn = function() {
      return this.getMaxMinColumn()['max'];
    };

    Waterfalls.prototype.getMaxMinColumn = function() {
      var maxHeight, maxHeightColumnIndex, minHeight, minHeightColumnIndex, opts, self, waterfallsHeightList;
      self = this;
      opts = self.opts;
      waterfallsHeightList = opts.waterfallsHeightList;
      minHeight = 99999;
      maxHeight = 0;
      maxHeightColumnIndex = 0;
      minHeightColumnIndex = 0;
      _.each(waterfallsHeightList, function(height, i) {
        if (height < minHeight) {
          minHeight = height;
          minHeightColumnIndex = i;
        }
        if (height > maxHeight) {
          maxHeight = height;
          return maxHeightColumnIndex = i;
        }
      });
      return {
        max: maxHeightColumnIndex,
        min: minHeightColumnIndex
      };
    };

    return Waterfalls;

  })();

  module.exports = Waterfalls;

}).call(this);