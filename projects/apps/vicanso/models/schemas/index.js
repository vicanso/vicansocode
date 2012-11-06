(function() {
  var fs, initSchemas, _;

  fs = require('fs');

  _ = require('underscore');

  /**
   * [initSchemas 初始化schema列表]
   * @param  {[type]} schemas [description]
   * @return {[type]}         [description]
  */


  initSchemas = function(schemas) {
    var files;
    files = fs.readdirSync(__dirname);
    _.each(files, function(file) {
      var schemaInfo;
      if (file !== 'index.js') {
        schemaInfo = require("./" + file);
        return schemas[schemaInfo.name] = schemaInfo.schema;
      }
    });
    return schemas;
  };

  module.exports = initSchemas({});

}).call(this);
