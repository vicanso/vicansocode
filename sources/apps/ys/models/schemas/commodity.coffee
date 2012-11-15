module.exports = 
  name : 'Commodity'
  schema :
    title : 
      type : String
      trim : true
      index : true
      required : true
    # 条形码
    barcode : 
      type : String
      trim : true
      index : true
      required : true
    price : Number
    # 包装方式
    package : String
    # 每件包含多少
    eachPackTotal : Number
    # 商品规格
    specification : String
    # 生产日期
    productionDate : Date
    # 保质期
    shelfList : String
    # 商品描述
    desc : String
    # 商品标签
    tags : Array
    # 商品URL
    url : String
    score : 
      type : Number
      default : 0
    # 商品图片
    pics : [
      {
        url : String
        area : 
          height : Number
          width : Number
      }
        
    ]
    # 记录创建时间
    createTime :
      type : Date
      default : Date.now
    # 记录修改时间
    modifiedTime : Date