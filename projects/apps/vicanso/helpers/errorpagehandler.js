(function() {
  var errorPageHandler;

  errorPageHandler = {
    response: function(statusCode, req, res, data) {
      if (data) {
        return res.send(statusCode, data);
      } else {
        return res.send(statusCode, 'error');
      }
    }
  };

  module.exports = errorPageHandler;

}).call(this);
