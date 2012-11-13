###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

fs = require 'fs'
_ = require 'underscore'
path = require 'path'
config = require '../config'
appPath = config.getAppPath()
fileMerger = require "#{appPath}/helpers/filemerger"
logger = require("#{appPath}/helpers/logger") __filename
isProductionMode = config.isProductionMode()
isMaster = config.isMaster()
###*
 * [run 在node的http启动前作的一些操作，合并静态文件等]
 * @return {[type]}
###
run = () ->
  if isProductionMode && isMaster
    removeTempPathFiles()
  else
    #合并文件处理（将部分js,css文件合并）
    fileMerger.mergeFilesBeforeRunning true

###*
 * [removeTempPathFiles 删除临时目录下的所有文件]
 * @return {[type]} [description]
###
removeTempPathFiles = () ->
  tempPath = config.getTempPath()
  fs.readdir tempPath, (err, tempFiles) ->
    if err
      logger.error err
    else
      _.each tempFiles, (file) ->
        fs.unlink path.join(tempPath, file), (err) ->
          if err
            logger.error err

module.exports.run = run