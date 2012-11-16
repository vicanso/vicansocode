net = require 'net'
localPort = 8888

net.createServer (client) ->
  buf = new Buffer 0
  client.on 'data', (data) ->
    buf = bufferConcat buf, data


bufferConcat = (buf1, buf2) ->
  buf = new Buffer buf1.length + buf2.length
  buf1.copy buf
  buf2.copy buf, buf1.length
  return buf



# http://php.js.cn/blog/nodejs-http-https-proxy/