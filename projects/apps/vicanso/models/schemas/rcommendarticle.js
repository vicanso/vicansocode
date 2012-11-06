(function() {

  module.exports = {
    name: 'RecommendArticle',
    schema: {
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
    }
  };

}).call(this);
