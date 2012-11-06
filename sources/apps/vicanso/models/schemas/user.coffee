module.exports =    
  name : 'User'
  schema :  
    account : 
      type : String
      trim : true
      index : true
      required : true
    password : 
      type : String
      trim : true
      index : true
      required : true
    userRight : 
      type : Number
      enum : [
        0
        1
      ]
    nickname : 
      type : String
      trim : true
      index : true
    sex : 
      type : String
      enum : [
        'male'
        'female'
      ]
    createTime : 
      type : Date
      default : Date.now
    logonTimes : Number

