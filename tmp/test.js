var express = require('express');
var app = express();
var str = '';
for(var i = 0; i < 3000; i++){
    str += 'aaaaaaaaaa';
}
var buf = new Buffer(str);
app.get('/', function(req, res){
  res.send(buf);
});

app.listen(3000);