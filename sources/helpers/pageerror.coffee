express = require 'express'
config = require '../config'
isProductionMode = config.isProductionMode()
pageError = 
  handler : () ->
    if isProductionMode
      return (err, req, res) ->
        # TODO add production error page
        
    else
      return express.errorHandler {
        dumpExceptions : true
        showStack : true
      }
  error : (status, msg) ->
    err = new Error msg
    err.status = status
    return err


module.exports = pageError