var express = require('express');
var cluster = require('cluster');
var numCpus = require('os').cpus().length;
var app = express();
var str = '';
for(var i = 0; i < 3; i++){
    str += 'aaaaaaaaaa';
}
var buf = new Buffer(str);
console.log('aà');
if(cluster.isMaster){
  for(var i = 0; i < numCpus; i++){
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal){
    console.log('worker ' + worker.process.pid + ' died');
  });
}else{
  app.get('/', function(req, res){
    res.send(buf);
  });
  app.listen(3000);
}

// app.get('/', function(req, res){
//   res.send(buf);
// });
// app.listen(3000);