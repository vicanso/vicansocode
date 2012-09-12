module.exports = (app) ->
  app.get '/', (req, res) ->
    console.log 'aaaaa'
    jadeView = 'vicanso/index.jade'
    data = 
      title : 'index'
    res.render jadeView, data, (err, html) ->
      console.log 'eeeeee'
      console.log html
      console.log res.send
      res.end html