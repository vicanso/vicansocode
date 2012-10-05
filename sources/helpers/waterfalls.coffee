_ = require 'underscore'

class Waterfalls
  constructor : (options) ->
    defaults = 
      column : 4
      waterfallsDataList : []
      waterfallsHeightList : []
      defaultHeight : 236
      defaultWidth : 236
      defaultOffset : 55
    @opts = _.extend defaults, options
    @init()
  init : () ->
    self = @
    opts = self.opts
    column = opts.column
    waterfallsDataList = opts.waterfallsDataList
    waterfallsHeightList = opts.waterfallsHeightList
    for i in [0...column]
      waterfallsDataList.push []
      waterfallsHeightList.push 0
    return self
  add : (item, index, height) ->
    self = @
    opts = self.opts
    column = opts.column
    waterfallsDataList = opts.waterfallsDataList
    waterfallsHeightList = opts.waterfallsHeightList

    if arguments.length is 0
      return self
    if _.isArray item
      docs = item
      _.each docs, (item, i) ->
        columnIndex = self.getMinHeightColumn()
        waterfallsDataList[columnIndex].push item
        area = item.pics?[0]?.area
        if area?
          itemWidth = area.width || opts.defaultWidth
          scale = opts.defaultWidth / itemWidth
          itemImageHeight = (area.height || opts.defaultHeight) * scale
        else
          itemImageHeight = opts.defaultHeight
        item.height = itemImageHeight + opts.defaultOffset
        item.imageHeight = itemImageHeight
        waterfallsHeightList[columnIndex] += item.height
    else
      index = index || 0
      height = height || opts.defaultHeight
      columnIndex = index % column
      WaterfallsData = waterfallsDataList[columnIndex]
      index = Math.floor index / column
      item.height = height
      if index is 0
        WaterfallsData.unshift item
      else
        WaterfallsData.splice index, 0, item
      waterfallsHeightList[columnIndex] += height
    return self
  getConfig : (balance) ->
    self = @
    opts = self.opts
    if balance is true
      self.balanceColumnsHeight()
    return {
      waterfallsWidth : opts.eachColumnWidth * opts.column
      data : opts.waterfallsDataList
    }
  balanceColumnsHeight : () ->
    self = @
    opts = self.opts
    column = opts.column
    waterfallsDataList = opts.waterfallsDataList
    waterfallsHeightList = opts.waterfallsHeightList

    maxMinColumn = self.getMaxMinColumn()
    maxColumnIndex = maxMinColumn.max
    minColumnIndex = maxMinColumn.min
    offsetHeight = waterfallsHeightList[maxColumnIndex] - waterfallsHeightList[minColumnIndex]

    if !_.isArray waterfallsDataList[maxColumnIndex]
      return self

    maxColumnItem = waterfallsDataList[maxColumnIndex].pop()
    if !maxColumnItem
      return self
    
    itemHeight = maxColumnItem.height
    while itemHeight < offsetHeight
      waterfallsDataList[minColumnIndex].push maxColumnItem
      waterfallsHeightList[maxColunmIndex] -= itemHeight
      waterfallsHeightList[minColumnIndex] += itemHeight


      maxMinColumn = self.getMaxMinColumn()
      maxColumnIndex = maxMinColumn.max
      minColumnIndex = maxMinColumn.min
      if maxColumnIndex is -1
        return self

      offsetHeight = waterfallsHeightList[maxColumnIndex] - waterfallsHeightList[minColumnIndex]

      if !_.isArray(waterfallsDataList[maxColumnIndex]) || waterfallsDataList[maxColumnIndex].length is 1
        return self
      maxColumnItem = waterfallsDataList[maxColumnIndex].pop()
      if !maxColumnItem
        return self
      itemHeight = maxColumnItem.height
    waterfallsDataList[maxColumnIndex].push maxColumnItem
    return self
  getMinHeightColumn : () ->
    return @getMaxMinColumn()['min']
  getMaxHeightColumn : () ->
    return @getMaxMinColumn()['max']
  getMaxMinColumn : () ->
    self = @
    opts = self.opts
    waterfallsHeightList = opts.waterfallsHeightList
    minHeight = 99999
    maxHeight = 0
    maxHeightColumnIndex = 0
    minHeightColumnIndex = 0
    _.each waterfallsHeightList, (height, i) ->
      if height < minHeight
        minHeight = height
        minHeightColumnIndex = i
      if height > maxHeight
        maxHeight = height
        maxHeightColumnIndex = i
    return {
      max : maxHeightColumnIndex
      min : minHeightColumnIndex
    }


module.exports = Waterfalls
