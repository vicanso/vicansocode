errorPageHandler = 
  response : (statusCode, req, res, data) ->
    if data
      res.send statusCode, data
    else
      res.send statusCode, 'error'

module.exports = errorPageHandler