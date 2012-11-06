(function() {

  module.exports = {
    name: 'Reflection',
    schema: {
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
    }
  };

}).call(this);
