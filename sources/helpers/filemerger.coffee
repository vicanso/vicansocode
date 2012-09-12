_ = require 'underscore'
path = require 'path'
fs = require 'fs'
mkdirp = require 'mkdirp'


Merger = 
  getMergeFile : (file, type) ->
    self = @
    mergerFile = ''
    if type is 'css'
      searchFiles = self.cssList
    else
      searchFiles = self.jsList
    _.each searchFiles, (files) ->
      if not mergeFile && (_.indexOf files, file) isnt -1
        mergeFile = files[0]
    return mergeFile
  ###*
   * [mergeFiles 合并文件]
   * @param  {[type]} mergingFiles [是否真实作读取文件合并的操作（由于有可能有多个worker进程，因此只需要主进程作真正的读取，合并扣件，其它的只需要整理合并列表）]
   * @return {[type]}              [description]
  ###
  mergeFiles : (mergingFiles) ->
    self = @
    _.each self, (mergerInfo, mergerType) ->
      if _.isArray mergerInfo
        mergeList = []
        _.each mergerInfo, (mergers) ->
          fileName = 'vicanso'
          combineFileName = ''
          filePathList = []
          _.each mergers, (fileInfo, key) ->
            fileName += "_#{key}"
            if key is 'combine'
              combineFileName = fileInfo.file
            else if fileInfo.index?
              filePathList[fileInfo.index] = fileInfo.file
          if filePathList.length isnt 0
            if combineFileName
              fileName = combineFileName
            else
              fileName = "/mergers/#{fileName}.#{mergerType}"
            mergeList.push [fileName].concat _.compact filePathList
        if mergingFiles
          _.each mergeList, (files) ->
            filePath = "#{path.dirname __dirname}/static/"
            saveFile = path.join filePath, files[0]
            content = ''
            _.each files, (file, i) ->
              if i isnt 0
                content +=  fs.readFileSync path.join filePath, file
            mkdirp path.dirname(saveFile), (err) ->
              fs.writeFileSync saveFile, content
        self["#{mergerType}List"] = mergeList
    delete self.js
    delete self.css
  js : [
    {
      combine :
        file : '/mergers/jquery.plugins.min.js'
      cookies : 
        file : '/common/javascripts/jquery/jquery.cookies.min.js'
        index : 0
      url : 
        file : '/common/javascripts/jquery/jquery.url.min.js'
        index : 1
      mousewheel : 
        file : '/common/javascripts/jquery/jquery.mousewheel.min.js'
        index : 2
    }
  ]
  css : [
    # {
    #   global : 
    #     file : '/stylesheets/global.css'
    #     index : 0
    #   header : 
    #     file : '/stylesheets/header.css'
    #     index : 1
    # }
  ]

module.exports = Merger