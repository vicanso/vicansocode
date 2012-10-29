mongoose = require 'mongoose'
ObjectId = mongoose.Schema.Types.ObjectId
schemas =
  Article :
    title : 
      type : String
      trim : true
      index : true
      required : true
    content : []
    tags : []
    createTime : 
      type : Date
      default : Date.now
  UserBehavior : 
    userId : ObjectId
    behavior : 
      type : String
      enum : [
        'like'
        'view'
      ]
    targetId : 
      type : ObjectId
      require : true
    createTime : 
      type : Date
      default : Date.now
  RecommendArticle :
    title : 
      type : String
      index : true
      trim : true
      require : true
    content : []
    source : 
      type : String
      trim : true
      require : true
    createTime : 
      type : Date
      default : Date.now  
  Reflection :
    title : 
      type : String
      index : true
      trim : true
      required : true
    content : []
    createTime : 
      type : Date
      default : Date.now
  NodeModule : 
    name : 
      type : String
      index : true
      trim : true
      required : true
    description : String
    homepage : String
    keywords : [String]
    author : String
    repository : String
    package : String
    main : String
    githubPage : String
    version : String
    createTime : 
      type : Date
      default : Date.now
  Test : 
    title :
      type : String
      trim : true
      required : true
    userId : Number
    content : []
    createTime :
      type : Date
      default : Date.now

module.exports = schemas


