(function() {
  var schemas;

  schemas = {
    Article: {
      title: {
        type: String,
        trim: true,
        index: true,
        required: true
      },
      content: [],
      createTime: {
        type: Date,
        "default": Date.now
      }
    },
    RecommendArticle: {
      title: {
        type: String,
        index: true,
        trim: true,
        require: true
      },
      content: [],
      source: {
        type: String,
        trim: true,
        require: true
      },
      createTime: {
        type: Date,
        "default": Date.now
      }
    },
    Reflection: {
      title: {
        type: String,
        index: true,
        trim: true,
        required: true
      },
      content: [],
      createTime: {
        type: Date,
        "default": Date.now
      }
    },
    Test: {
      title: {
        type: String,
        trim: true,
        required: true
      },
      userId: Number,
      content: [],
      createTime: {
        type: Date,
        "default": Date.now
      }
    }
  };

  module.exports = schemas;

}).call(this);
