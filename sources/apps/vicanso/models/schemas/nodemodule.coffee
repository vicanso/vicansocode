module.exports =    
  name : 'NodeModule'
  schema :  
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
      