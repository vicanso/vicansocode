(function() {

  module.exports = function(app) {
    return app.get('/', function(req, res) {
      var data, jadeView;
      console.log('aaaaa');
      jadeView = 'vicanso/index.jade';
      data = {
        title: 'index'
      };
      return res.render(jadeView, data, function(err, html) {
        console.log('eeeeee');
        console.log(html);
        console.log(res.send);
        return res.end(html);
      });
    });
  };

}).call(this);
