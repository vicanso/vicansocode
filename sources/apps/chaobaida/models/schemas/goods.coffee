mongoose = require 'mongoose'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

tagType = new Schema {
  tid : 
    type : String
    index : true
  name : String
}
categoryType = new Schema {
  cid : 
    type : String
    index : true
  name : String
}

module.exports =
  name : 'Goods'
  indexList : [
    {
      delistTime : -1
      itemPrice : 1
      'data.baoyou.date' : 1
      'categories.cid' : 1
      'data.score' : -1
    }
    {
      'categories.cid' : 1
      'data.score' : -1
    }
    {
      'tags.tid' : 1
      'data.score' : -1
    }
    {
      'data.baoyou.id' : 1
    }
  ]
  schema : 
    itemId :
      type : String
      index : true
    merchantId : Number
    itemOId :
      type : ObjectId
      index : true
    title : String
    brand : 
      type : String
      index : true
    sellerName : 
      type : String
      index : true
    listTime : Number
    delistTime : Number
    picColor : 
      value : String
      coefficient : Number
    props : {}
    itemPrice : Number
    marketPrice : Number
    tags :
      type : [
        tagType
      ]
    categories :
      type : [
        categoryType
      ]
    userTags :
      type : Array
      index : true
    picUrl : String
    itemUrl : String
    clickUrl : String
    itemState : Number
    createTime : Number
    modifyTime : Number
    data : {}



