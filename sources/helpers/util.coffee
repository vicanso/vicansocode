_ = require 'underscore'
async = require 'async'
fs = require 'fs'
crypto = require 'crypto'
logger = require('log4js').getLogger()

util =
  mergeFiles : (files, saveFile) ->
    funcs = []
    _.each files, (file) ->
      funcs.push (cbf) ->
        fs.readFile file, 'utf8', (err, data) ->
          cbf err, data
    async.parallel funcs, (err, results) ->
      if err
        logger.error err
      else
        fs.writeFile saveFile, results.join ''
  md5 : (data, digestType) ->
    return @crypto data, 'md5', digestType
  sha1 : (data, digestType) ->
    return @crypto data, 'sha1', digestType
  crypto : (data, type, digestType) ->
    digestType ?= 'hex'
    cryptoData = crypto.createHash(type).update(data).digest digestType
    return cryptoData


module.exports = util