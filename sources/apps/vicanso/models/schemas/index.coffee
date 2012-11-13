fs = require 'fs'
_ = require 'underscore'

###*
 * [initSchemas 初始化schema列表]
 * @param  {[type]} schemas [description]
 * @return {[type]}         [description]
###
initSchemas = (schemas) ->
  # require当前目录下的所有文件(除index.js)，每个文件都是一个schema的描述
  files = fs.readdirSync __dirname
  _.each files, (file) ->
    if file != 'index.js'
      schemaInfo = require "./#{file}"
      schemas[schemaInfo.name] = schemaInfo.schema
  return schemas
module.exports[key] = func for key, func of initSchemas {}