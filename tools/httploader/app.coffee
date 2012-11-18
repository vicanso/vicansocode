commander = require 'commander'
request = require 'request'
async = require 'async'


splitArgs = (val) ->
  return val.split ','

initArguments = (program) ->
  program.version('0.0.1')
  .option('-n, --requests <n>', 'Number of requests to perform', parseInt)
  .option('-c, --concurrency <n>', 'Number of multiple requests to make', parseInt)
  .option('-l, --urls <n>', 'Rquest url list, separated by ","', splitArgs)
  .parse process.argv

initArguments commander


startTest = (limit, urls) ->
  console.log "limit:#{limit}"
  console.time 'startTest'
  async.forEachLimit urls, limit, (url, cbf) ->
    request url, (err, res, body) ->
      if err
        console.error err
      console.log res.statusCode
      cbf()
  ,() ->
    console.log 'finished'
    console.timeEnd 'startTest'

createUrls = (urls, total) ->
  results = []
  urlTotal = urls.length
  for i in [0...total]
    index = Math.floor Math.random() * urlTotal
    results.push urls[index]
  return results
startTest commander.requests,  createUrls commander.urls, commander.concurrency