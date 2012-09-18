_ = require 'underscore'
path = require 'path'
fs = require 'fs'
mkdirp = require 'mkdirp'

config = require '../config'
appPath = config.getAppPath()
tempPath = config.getTempPath()
staticPath = config.getStaticPath()
myUtil = require "#{appPath}/helpers/util"

tempFilesStatus = {}

Merger = 
  ###*
   * [getMergeFile 根据当前文件返回合并对应的文件名，若该文件未被合并，则返回空字符串]
   * @param  {[type]} file [当前文件]
   * @param  {[type]} type [文件类型]
   * @return {[type]}      [返回合并后的文件名]
  ###
  getMergeFile : (file, type) ->
    self = @
    mergeFile = ''
    if type is 'css'
      searchFiles = self.cssList
    else
      searchFiles = self.jsList
    _.each searchFiles, (searchInfo) ->
      files = searchInfo.files
      if not mergeFile && (_.indexOf files, file, true) isnt -1
        mergeFile = searchInfo.name
    return mergeFile
  ###*
   * [mergeFilesBeforeRunning 合并文件(在程序运行之前，主要是把一些公共的文件合并成一个，减少HTTP请求)]
   * @param  {[type]} mergingFiles [是否真实作读取文件合并的操作（由于有可能有多个worker进程，因此只需要主进程作真正的读取，合并扣件，其它的只需要整理合并列表）]
   * @return {[type]}              [description]
  ###
  mergeFilesBeforeRunning : (mergingFiles) ->
    self = @
    mergeFiles = config.getMergeFiles()
    _.each mergeFiles, (mergerInfo, mergerType) ->
      if _.isArray mergerInfo
        mergeList = []
        _.each mergerInfo, (mergers) ->
          mergeList.push mergers
        if mergingFiles
          _.each mergeList, (mergers) ->
            saveFile = path.join staticPath, mergers.name
            content = ''
            _.each mergers.files, (file, i) ->
              content +=  fs.readFileSync path.join staticPath, file
            mkdirp path.dirname(saveFile), (err) ->
              if err
                logger.error err
              fs.writeFileSync saveFile, content
            mergers.files.sort()
        self["#{mergerType}List"] = mergeList

  ###*
   * [mergeFilesToTemp 将文件合并到临时文件夹，合并的文件根据所有文件的文件名通过sha1生成，若调用的时候，该文件已生成，则返回文件名，若未生成，则返回空字符串]
   * @param  {[type]} mergeFiles [合并文件列表]
   * @param  {[type]} type       [文件类型（用于作为文件后缀）]
   * @return {[type]}            [合并后的文件名]
  ###
  mergeFilesToTemp : (mergeFiles, type) ->
    linkFileHash = myUtil.sha1 mergeFiles.join ''
    linkFileName = "#{linkFileHash}.#{type}" 
    saveFile = path.join tempPath, linkFileName
    if tempFilesStatus[linkFileHash] == 'complete'
      return linkFileName
    else
      if !tempFilesStatus[linkFileHash]
        tempFilesStatus[linkFileHash] = 'merging'
        myUtil.mergeFiles mergeFiles, saveFile, (data, file, saveFile) ->
          imagesPath = path.relative path.dirname(saveFile), path.dirname(file)
          imagesPath = path.join imagesPath, '../images'
          data = data.replace /..\/images/g, imagesPath 
          return data
        ,(err) ->
          if !err
            tempFilesStatus[linkFileHash] = 'complete'
      return ''


module.exports = Merger