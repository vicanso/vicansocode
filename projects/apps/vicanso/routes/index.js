(function() {

  module.exports = function(app) {
    return app.get('/', function(req, res) {
      return res.send('hello world');
    });
  };

}).call(this);
