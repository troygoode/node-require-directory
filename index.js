var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;

var requireDirectory = function(m, path, delegate){
  if(delegate === null || delegate === undefined) {
    delegate = function(){ return true; };
  }
  var retval = {};
  path = resolve(path);
  fs.readdirSync(path).forEach(function(filename){
    var joined = join(path, filename);
    if(delegate(joined)){
      if(fs.statSync(joined).isDirectory()){
        retval[filename] = requireDirectory(m, joined, delegate);
      }else{
        var name = filename.substring(0, filename.lastIndexOf('.'));
        retval[name] = m.require(joined);
      }
    }
  });
  return retval;
};

module.exports = requireDirectory;
