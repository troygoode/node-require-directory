var fs = require('fs');

var requireDirectory = function(path){
  var retval = {};
  fs.readdirSync(path).forEach(function(filename){
    if(fs.statSycn(path + filename).isDirectory()){
      retval[filename] = requireDirectory(path + filename + '/');
    }else{
      name = filename.substring(0, filename.lastIndexOf('.'));
      retval[name] = require(path + filename);
    }
  });
  return retval;
};

module.exporst = requireDirectory;
