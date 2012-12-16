var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;

var requireDirectory = function(m, path, exclude){
  var origin = m.filename;
  var delegate = function(){ return true; };
  var retval = {};

  if(exclude instanceof RegExp){
    delegate = function(path){
      if(exclude.test(path)){
        return false;
      }else{
        return true;
      }
    };
  }else if(exclude && {}.toString.call(exclude) === '[object Function]'){
    delegate = exclude;
  }

  path = resolve(path);
  fs.readdirSync(path).forEach(function(filename){
    var joined = join(path, filename);
    if(joined !== origin && delegate(joined)){
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
