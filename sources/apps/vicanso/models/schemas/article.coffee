module.exports =    
  name : 'Article'
  schema :  
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
