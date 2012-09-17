config = require '../../../config'
appPath = config.getAppPath()
webConfig = require "#{appPath}/apps/vicanso/helpers/webconfig"

viewContentHandler = 
  index : (fileImporter) ->
    viewData = 
      title : '每天再往前一点！'
      fileImporter : fileImporter
      viewContent : 
        header : webConfig.getHeader 0
        
    return viewData

module.exports = viewContentHandler
