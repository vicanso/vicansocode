(function() {
  var schemas;

  schemas = {
    Commodity: {
      title: {
        type: String,
        trim: true,
        index: true,
        required: true
      },
      barcode: {
        type: String,
        trim: true,
        index: true,
        required: true
      },
      price: Number,
      "package": String,
      eachPackTotal: Number,
      specification: String,
      productionDate: Date,
      shelfList: String,
      desc: String,
      tags: Array,
      url: String,
      score: {
        type: Number,
        "default": 0
      },
      pics: [
        {
          url: String,
          area: {
            height: Number,
            width: Number
          }
        }
      ],
      createTime: {
        type: Date,
        "default": Date.now
      },
      modifiedTime: Date
    }
  };

  module.exports = schemas;

}).call(this);
