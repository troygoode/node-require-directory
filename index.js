var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;

var requireDirectory = function(m, path){
  var retval = {};
  path = resolve(path);
  fs.readdirSync(path).forEach(function(filename){
    var joined = join(path, filename);
    if(fs.statSync(joined).isDirectory()){
      retval[filename] = requireDirectory(m, joined);
    }else{
      var name = filename.substring(0, filename.lastIndexOf('.'));
      retval[name] = m.require(joined);
    }
  });
  return retval;
};

module.exports = requireDirectory;
