config = require '../../../config'
appPath = config.getAppPath()
viewContentHandler = require "#{appPath}/apps/ys/helpers/viewcontenthandler"
FileImporter = require "#{appPath}/helpers/fileimporter"
httpHandler = require "#{appPath}/helpers/httphandler"
mongoClient = require "#{appPath}/apps/ys/models/mongoclient"
viewDataHandler = require "#{appPath}/apps/ys/helpers/viewdatahandler"
logger = require("#{appPath}/helpers/logger") __filename

module.exports = (app) ->
  app.get '/ys/javascripts/info.min.js', (req, res) ->
    info = 
      host : req.host
      paths : 
        home : '/ys'
    res.header 'Content-Type', 'application/javascript'
    res.send "var INFO = #{JSON.stringify(info)}"

  app.get '/ys', home
  app.get '/ys/page/:page', home
  app.get '/ys/tag/:tag/page/:page', home
  app.get '/ys/tag/:tag', home
  app.get '/ys', home

  app.get '/ys/commoditymodify/:id', commodityModify

  app.post '/ys/action/savecommodity', saveCommodityHandler

  app.get '/ys/initscore', initScore

initScore = (req, res, next) ->
  viewDataHandler.initScore (err, data) ->
    res.send 'success'

saveCommodityHandler = (req, res, next) ->
  data = req.body
  id = data._id
  delete data._id
  data.modifiedTime = new Date()
  data.price = data.price || 0
  console.dir data
  viewDataHandler.save id, data, (err, data) ->
    console.log "err:#{err}"
    if err
      data = 
        code : 1000
        msg : err.toString()
    else
      data = 
        code : 0
        msg : 'success'
    res.send JSON.stringify data

commodityModify = (req, res, next) ->
  id = req.params.id
  viewDataHandler.commodity id, (err, data) ->
    console.dir data
    if err
      res.render 'error', 504
    else
      view = 'ys/commodity_modify'
      jadeView = 'ys/commodity_modify'
      debug = !config.isProductionMode()
      fileImporter = new FileImporter debug

      viewData = viewContentHandler.commodityModify fileImporter, data
      httpHandler.render req, res, jadeView, viewData

home = (req, res, next) ->
  params = req.params
  currentPage = global.parseInt params.page || 1
  tag = params.tag
  title = req.query.title
  eachPageTotal = 30
  options = 
    # sort : 'modifiedTime'
    sort : 
      score : -1
    limit : eachPageTotal
    skip : eachPageTotal * (currentPage - 1)
  if tag
    query = 
      tags : 
        $all : [
          tag
        ]
  else if title
    query = 
      title : title
  else
    query = {}

  viewDataHandler.home query, options, (err, result) ->
    logger.info result.data
    if err
      res.render 'error', 504
    else
      pageConfig =
        currentPage : currentPage
        eachPageTotal : eachPageTotal
        total : result.total
      jadeView = 'ys/home'
      debug = !config.isProductionMode()
      fileImporter = new FileImporter debug
      viewData = viewContentHandler.home fileImporter, result.data, pageConfig, tag
      httpHandler.render req, res, jadeView, viewData