config = require '../../config'
appPath = config.getAppPath()

init = (app) ->
  require("#{appPath}/apps/ys/routes") app

module.exports = init