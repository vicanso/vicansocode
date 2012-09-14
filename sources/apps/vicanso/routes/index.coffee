config = require '../../../config'
appPath = config.getAppPath()
viewContentHandler = require "#{appPath}/apps/vicanso/helpers/viewcontenthandler"
FileImporter = require "#{appPath}/helpers/fileimporter"
httpHandler = require "#{appPath}/helpers/httphandler"

module.exports = (app) ->
  app.get '/', (req, res) ->
    jadeView = 'vicanso/index'
    fileImporter = new FileImporter()
    viewData = viewContentHandler.index fileImporter
    httpHandler.render req, res, jadeView, viewData