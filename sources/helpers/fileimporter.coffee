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
    @cssFIles = []
    @jsFiles = []
  ###*
   * [importCss description]
   * @param  {[type]} path     [css路径]
   * @param  {[type]} prepend [是否插入到数组最前（在HTML中首先输出）]
   * @return {[type]}         [description]
  ###
  importCss : (path, prepend) ->
    self = @
    self.importFiles path, 'css', prepend
    return self
  ###*
   * [importJs description]
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
        mergerFile = fileMerger.getMergerFile path, type
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
   * @return {[type]} [description]
  ###
  exportCss : () ->
    self = @
    cssFileList = []
    _.each self.cssFiles, (cssFile) ->
      if cssFile.indexOf('http') isnt 0
        cssFile = Path.join(staticPrefix, cssFile) + "?version=#{version}"
      cssFileList.push '<link rel="stylesheet" href="' + cssFile + '" type="text/css" media="screen" />'
    return cssFileList.join ''
  exportJs : () ->
    self = @
    jsFileList = []
    _.each self.jsFiles, (jsFile) ->
      if self.debug
        jsFile = ('' + jsFile).replace '.min.js', '.js'
      if jsFile.indexOf('http') isnt 0
        jsFile = Path.join(staticPrefix, jsFile) + "?version=#{version}"
      jsFileList.push '<script type="text/javascript" src="' + jsFile + '"></script>'
    return jsFileList.join ''

module.exports = FileImporter
