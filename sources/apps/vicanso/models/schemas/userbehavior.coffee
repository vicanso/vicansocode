mongoose = require 'mongoose'
ObjectId = mongoose.Schema.Types.ObjectId
module.exports =    
  name : 'UserBehavior'
  schema :  
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
      