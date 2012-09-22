_ = require 'underscore'
path = require 'path'
fs = require 'fs'

config = require '../config'
appPath = config.getAppPath()
fileMerger = require "#{appPath}/helpers/filemerger"

STATIC_PREFIX = config.getStaticPrefix()
VERSION = new Date().getTime()


class FileImporter
  ###*
   * [constructor description]
   * @param  {[type]} debug [是否debug模式，debug模式下将.min.js替换为.js]
   * @return {[type]}       [description]
  ###
  constructor : (debug) ->
    @cssFiles = []
    @jsFiles = []
    @debug = debug || false
  ###*
   * [importCss 引入css文件]
   * @param  {[type]} path     [css路径]
   * @param  {[type]} prepend [是否插入到数组最前（在HTML中首先输出）]
   * @return {[type]}         [description]
  ###
  importCss : (path, prepend) ->
    self = @
    self.importFiles path, 'css', prepend
    return self
  ###*
   * [importJs 引入js文件]
   * @param  {[type]} path    [js路径]
   * @param  {[type]} prepend [是否插入到数组最前（在HTML中首先输出）]
   * @return {[type]}         [description]
  ###
  importJs : (path, prepend) ->
    self = @
    self.importFiles path, 'js', prepend
    return self
  ###*
   * [importFiles description]
   * @param  {[type]} path    [文件路径]
   * @param  {[type]} type    [文件类型(css, js)]
   * @param  {[type]} prepend [是否插入到数组最前（在HTML中首先输出）]
   * @return {[type]}         [description]
  ###
  importFiles : (path, type, prepend) ->
    self = @
    if _.isString path
      path = path.trim()
      if not self.debug
        mergerFile = fileMerger.getMergeFile path, type
        if mergerFile
          path = mergerFile
      if type is 'css'
        if _.indexOf(self.cssFiles, path) is -1
          if prepend
            self.cssFiles.unshift path
          else
            self.cssFiles.push path
      else if _.indexOf(self.jsFiles, path) is -1
        if prepend
          self.jsFiles.unshift path
        else
          self.jsFiles.push path
    else if _.isArray path
      if prepend
        path.reverse()
      _.each path, (item) ->
        self.importFiles item, type, prepend
    return self
  ###*
   * [exportCss description]
   * @param  {[type]} merge [description]
   * @return {[type]}       [description]
  ###
  exportCss : (merge) ->
    self = @
    cssFileList = []
    mergeFiles = []
    _.each self.cssFiles, (cssFile) ->
      if cssFile.indexOf('http') isnt 0
        cssFile = path.join(STATIC_PREFIX, cssFile)
        mergeFiles.push path.join appPath, cssFile
      cssFileList.push '<link rel="stylesheet" href="' + cssFile + "?version=#{VERSION}" + '" type="text/css" media="screen" />'
    if !merge || self.debug
      return cssFileList.join ''
    linkFileName = fileMerger.mergeFilesToTemp mergeFiles, 'css'
    if linkFileName
      linkFileName = path.join config.getTempStaticPrefix(), linkFileName
      return '<link rel="stylesheet" href="' + linkFileName + "?version=#{VERSION}" + '" type="text/css" media="screen" />'
    else
      return cssFileList.join ''
  exportJs : (merge) ->
    self = @
    jsFileList = []
    mergeFiles = []
    _.each self.jsFiles, (jsFile) ->
      if self.debug
        jsFile = ('' + jsFile).replace '.min.js', '.js'
      if jsFile.indexOf('http') isnt 0
        jsFile = path.join(STATIC_PREFIX, jsFile) + "?version=#{VERSION}"
        mergeFiles.push path.join appPath, jsFile
      jsFileList.push '<script type="text/javascript" src="' + jsFile + '"></script>'
    if !merge || self.debug
      return jsFileList.join ''
    linkFileName = fileMerger.mergeFilesToTemp mergeFiles, 'js'
    if linkFileName
      linkFileName = path.join config.getTempStaticPrefix(), linkFileName
      return '<script type="text/javascript" src="' + linkFileName + "?version=#{VERSION}" + '"></script>'
    else
      return jsFileList.join ''

module.exports = FileImporter
