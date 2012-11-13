errorPageHandler = 
  response : (statusCode, req, res, data) ->
    if data
      res.send statusCode, data
    else
      res.send statusCode, 'error'

module.exports[key] = func for key, func of errorPageHandler