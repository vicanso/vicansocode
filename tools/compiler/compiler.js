var fs = require('fs');
var logger  = require('log4js').getLogger();
var path = require('path');
var _ = require('underscore');
var async = require('async');
var less = require('less');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var coffeeScript = require('coffee-script');


/**
 * getWatchFiles 获取监听文件列表
 * @param  {[type]} watchPath  监听目录
 * @param  {[type]} ext        监听文件后缀
 * @param  {[type]} resultFiles 用于保存监听文件列表的数组
 * @param  {[type]} cbf        完成时调用的callback
 * @return {[type]}            [description]
 */
var getWatchFiles = function(watchPath, ext, resultFiles, cbf){
  fs.readdir(watchPath, function(err, files){
    if(err){
      logger.error(err);
      cbf();
      return ;
    }
    async.forEachLimit(files, 10, function(file, cbf){
      if(file.substring(0, 1) === '.'){
        process.nextTick(cbf);
      }else{
        file = path.join(watchPath, file);
        fs.stat(file, function(err, stat){
          if(err){
            cbf();
          }
          else if(stat.isFile()){
            if(path.extname(file) === ext && file.indexOf('.min' + ext) === -1){
              resultFiles.push(file);
            }
            cbf();
          }else{
            getWatchFiles(file, ext, resultFiles, cbf);
          }
        });
      }
    },function(err){
      if(err){
        logger.error(err);
      }
      cbf();
    });
  });
};

/**
 * compileLess 编译less文件
 * @param  {[type]} file    less源文件
 * @param  {[type]} cssFile 编译之后保存的css文件
 * @return {[type]}         [description]
 */
var compileLess = function(file, cssFile){
  fs.readFile(file, 'utf8', function(err, data){
    if(err){
      logger.error(err);
      return ;
    }
    var parser = new less.Parser();
    try{
      parser.parse(data, function(err, tree){
        if(err){
          logger.error(err);
          return ;
        }
        fs.writeFile(cssFile, tree.toCSS({compress : true}), 'utf8', function(err){
          if(err){
            logger.error(err);
          }else{
            logger.info('complie css file:' + cssFile + ' successful');
          }
        });
      });
    }catch(err){
      logger.error(err);
    }
  });
};

/**
 * compressJavascript 压缩javascript文件
 * @param  {[type]} file      未压缩的js源文件
 * @param  {[type]} minJsFile 压缩之后保存的js文件
 * @return {[type]}           [description]
 */
var compressJavascript = function(file, minJsFile){
  fs.readFile(file, 'utf8', function(err, data){
    if(err){
      logger.error(err);
      return ;
    }
    var finalCode;
    try{
      var ast = jsp.parse(data);
      ast = pro.ast_lift_variables(ast);
      ast = pro.ast_mangle(ast, {
        mangle : true
      });
      ast = pro.ast_squeeze(ast, {
        dead_code : false
      });
      finalCode = pro.gen_code(ast, {
        ascii_only : true
      });
    }catch(err){
      logger.error(err);
    }
    fs.writeFile(minJsFile, finalCode, 'utf8', function(err){
      if(err){
        logger.error(err);
      }else{
        logger.info('compress js files:' + minJsFile + ' successful');
      }
    });
  });
};

/**
 * compileCoffeeScript 编译coffee到javascript
 * @param  {[type]} file   coffee源文件
 * @param  {[type]} jsFile javascript目标文件
 * @return {[type]}        [description]
 */
var compileCoffeeScript = function(file, jsFile){
  fs.readFile(file, 'utf8', function(err, data){
    if(err){
      logger.error(err);
      return ;
    }
    var jsCode;
    try{
      jsCode = coffeeScript.compile(data);
    }catch(err){
      if(err){
        logger.error(err);
      }
    }
    fs.writeFile(jsFile, jsCode, 'utf8', function(err){
      if(err){
        logger.error(err);
      }
    });
  });
};

/**
 * startWatchFiles 开始监听目录
 * @param  {[type]} watchConfig 一些关于监听的配置参数
 * @return {[type]}             [description]
 */
var startWatchFiles = function(watchConfig){
  var resultFiles = [];
  var cbf = function(){
    var compileFunc = _.debounce(function(file){
      var ext = path.extname(file);
      var saveFile, newExt;
      switch(ext){
        case '.less':
          newExt = '.css';
        break;
        case '.js':
          newExt = '.min.js';
        break;
        case '.coffee':
          newExt = '.js';
        break;
      }
      if(newExt){
        saveFile = file.replace(ext, newExt);
        var handleFunction = handleFunctions[ext.substring(1)];
        if(handleFunction){
          handleFunction(file, saveFile);
        }
      }
    }, watchConfig.delay);
    _.each(resultFiles, function(file){
      fs.watchFile(file, {persistent : true, interval : 2000},function(curr, prev){
        compileFunc(file);
      });
    });
  };
  getWatchFiles(watchConfig.path, watchConfig.ext, resultFiles, cbf);
};


var handleFunctions = {
  less : compileLess,
  coffee : compileCoffeeScript,
  js : compressJavascript
};


var jsfileWatchConfig = {
  path : '/Users/vicanso/workspace/onepiece/public',
  ext : '.less',
  delay : 1000
};
startWatchFiles(jsfileWatchConfig);
