var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;

var requireDirectory = function(m, path, opt){
  var delegate = function(){ return true; };
  if(opt instanceof RegExp){
    delegate = function(path){
      if(opt.test(path)){
        return false;
      }else{
        return true;
      }
    };
  }else if(opt && {}.toString.call(opt) === '[object Function]'){
    delegate = opt;
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
