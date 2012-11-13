###*!
* Copyright(c) 2012 vicanso 腻味
* MIT Licensed
###

_ = require 'underscore'
path = require 'path'
fs = require 'fs'
mkdirp = require 'mkdirp'

config = require '../config'
appPath = config.getAppPath()
tempPath = config.getTempPath()
staticPath = config.getStaticPath()
myUtil = require "#{appPath}/helpers/util"
logger = require("#{appPath}/helpers/logger") __filename

tempFilesStatus = {}

fileMerger = 
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
      if not mergeFile && (_.indexOf files, file, true) != -1
        mergeFile = searchInfo.name
    return mergeFile
  ###*
   * [isMergeByOthers 该文件是否是由其它文件合并而来]
   * @param  {[type]}  file [description]
   * @return {Boolean}      [description]
  ###
  isMergeByOthers : (file) ->
    self = @
    files = _.pluck(self.cssList, 'name').concat _.pluck self.jsList, 'name'
    return _.indexOf(files, file) != -1
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
            content = []
            _.each mergers.files, (file, i) ->
              content .push fs.readFileSync path.join(staticPath, file), 'utf8'
            mkdirp path.dirname(saveFile), (err) ->
              if err
                logger.error err
              fileSplit = ''
              if mergerType == 'js'
                fileSplit = ';'
              fs.writeFileSync saveFile, content.join fileSplit
            mergers.files.sort()
        self["#{mergerType}List"] = mergeList

  ###*
   * [mergeFilesToTemp 将文件合并到临时文件夹，合并的文件根据所有文件的文件名通过sha1生成，若调用的时候，该文件已生成，则返回文件名，若未生成，则返回空字符串]
   * @param  {[type]} mergeFiles [合并文件列表]
   * @param  {[type]} type       [文件类型（用于作为文件后缀）]
   * @return {[type]}            [合并后的文件名]
  ###
  mergeFilesToTemp : (mergeFiles, type) ->
    #已提前作合并的文件不再作合并
    mergeFiles = _.filter mergeFiles, (file) ->
      return fileMerger.getMergeFile(file, type) == ''
    linkFileHash = myUtil.sha1 mergeFiles.join ''
    linkFileName = "#{linkFileHash}.#{type}" 

    saveFile = path.join tempPath, linkFileName
    # 判断该文件是否已成生成好，若生成好，HTML直接加载该文件
    if tempFilesStatus[linkFileHash] == 'complete' || fs.existsSync saveFile
      return linkFileName
    else
      # 判断是否该文件正在合并中，若正在合并，则直接返回空字符串。若不是，则调用合并，并在状态记录中标记为merging
      if !tempFilesStatus[linkFileHash]
        tempFilesStatus[linkFileHash] = 'merging'
        myUtil.mergeFiles mergeFiles, saveFile, (data, file, saveFile) ->
          imagesPath = path.relative path.dirname(saveFile), path.dirname(file)
          imagesPath = path.join imagesPath, '../images'
          data = data.replace /..\/images/g, imagesPath 
          return data
        ,(err) ->
          if err
            delete tempFilesStatus[linkFileHash]
            logger.error err
          else
            tempFilesStatus[linkFileHash] = 'complete'
      return ''

module.exports[key] = func for key, func of fileMerger
