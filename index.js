var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;
var dirname = require('path').dirname;

var requireDirectory = module.exports = function(m, path, exclude){
  var delegate = function(){ return true; }; // default delegate includes everything
  var retval = {};

  // if no path was passed in, assume the equivelant of __dirname from caller
  if(!path){
    path = dirname(m.filename);
  }

  // if a RegExp was passed in as exclude, create a delegate that blacklists that RegExp
  // if a function was passed in as exclude, use that function as the delegate
  // default to an always-yes delegate
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

  // get the path of each file in specified directory, append to current tree node, recurse
  path = resolve(path);
  fs.readdirSync(path).forEach(function(filename){
    if(filename[0] === '.'){ //ignore hidden files
      return;
    }
    var joined = join(path, filename);
    if(joined !== m.filename && delegate(joined)){
      if(fs.statSync(joined).isDirectory()){
        retval[filename] = requireDirectory(m, joined, delegate); // this node is a directory; recurse
      }else{
        var name = filename.substring(0, filename.lastIndexOf('.')); // hash node shouldn't include file extension
        retval[name] = m.require(joined);
      }
    }
  });
  return retval;
};
