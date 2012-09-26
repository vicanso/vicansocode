_ = require 'underscore'
async = require 'async'
fs = require 'fs'
crypto = require 'crypto'
path = require 'path'
_ = require 'underscore'
mkdirp = require 'mkdirp'
config = require '../config'
appPath = config.getAppPath()
logger = require("#{appPath}/helpers/logger") __filename

noop = () ->

util =
  ###*
   * [mergeFiles 合并文件]
   * @param  {[type]} files       [需要合并的文件列表]
   * @param  {[type]} saveFile    [保存的文件]
   * @param  {[type]} dataConvert [需要对数据作的转化，如果不需要转换，该参数作为完成时的call back]
   * @param  {[type]} cbf         [完成时的call back]
   * @return {[type]}             [description]
  ###
  mergeFiles : (files, saveFile, dataConvert, cbf) ->
    funcs = []
    if arguments.length == 3
      cbf = dataConvert
      dataConvert = null
    cbf = cbf || noop
    _.each files, (file) ->
      # imagesPath = path.relative path.dirname(saveFile), path.dirname(file)
      # imagesPath = path.join imagesPath, '../images'
      # console.log imagesPath
      funcs.push (cbf) ->
        fs.readFile file, 'utf8', (err, data) ->
          if !err && dataConvert
            data = dataConvert data, file, saveFile
          cbf err, data
    async.parallel funcs, (err, results) ->
      if err
        logger.error err
        cbf err
      else
        mkdirp path.dirname(saveFile), (err) ->
          if err
            logger.error err
            cbf err
          else
            fs.writeFile saveFile, results.join(''), cbf
  ###*
   * [md5 md5加密]
   * @param  {[type]} data       [加密的数据]
   * @param  {[type]} digestType [加密数据返回格式，若不传该参数则以hex的形式返回]
   * @return {[type]}            [description]
  ###
  md5 : (data, digestType) ->
    return @crypto data, 'md5', digestType
  ###*
   * [sha1 sha1加密，参数和md5加密一致]
   * @param  {[type]} data       [加密的数据]
   * @param  {[type]} digestType [加密数据返回格式，若不传该参数则以hex的形式返回]
   * @return {[type]}            [description]
  ###
  sha1 : (data, digestType) ->
    return @crypto data, 'sha1', digestType
  ###*
   * [crypto 加密]
   * @param  {[type]} data       [加密数据]
   * @param  {[type]} type       [加密类型，可选为:md5, sha1等]
   * @param  {[type]} digestType [加密数据的返回类型，若不传该参数则以hex的形式返回]
   * @return {[type]}            [description]
  ###
  crypto : (data, type, digestType) ->
    digestType ?= 'hex'
    cryptoData = crypto.createHash(type).update(data).digest digestType
    return cryptoData


module.exports = util