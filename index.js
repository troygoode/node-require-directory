var fs = require('fs');

var requireDirectory = function(path){
  var retval = {};
  fs.readdirSync(path).forEach(function(filename){
    if(fs.statSync(path + filename).isDirectory()){
      retval[filename] = requireDirectory(path + filename + '/');
    }else{
      var name = filename.substring(0, filename.lastIndexOf('.'));
      retval[name] = require(path + filename);
    }
  });
  return retval;
};

module.exports = requireDirectory;
