var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;
var dirname = require('path').dirname;

var toCamel = function(string) {
  return string.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); })
};

var requireDirectory = module.exports = function(m, path, exclude, camelCase, callback){
  var defaultDelegate = function(path, filename){
    return filename[0] !== '.' && /\.(js|json|coffee)$/i.test(filename);
  };
  var delegate = defaultDelegate;
  var retval = {};

  // if no path was passed in, assume the equivelant of __dirname from caller
  if(!path){
    path = dirname(m.filename);
  }

  // if a RegExp was passed in as exclude, create a delegate that blacklists that RegExp
  // if a function was passed in as exclude, use that function as the delegate
  // default to an always-yes delegate
  if(exclude instanceof RegExp){
    delegate = function(path, filename){
      if(!defaultDelegate(path, filename)){
        return false;
      }else if(exclude.test(path)){
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
    var joined = join(path, filename);
    if(fs.statSync(joined).isDirectory()){
      var files = requireDirectory(m, joined, delegate, camelCase, callback); // this node is a directory; recurse
      if (Object.keys(files).length){
        var key = camelCase ? toCamel(filename) : filename
        retval[key] = files;
      }
    }else{
      if(joined !== m.filename && delegate(joined, filename)){
        var name = filename.substring(0, filename.lastIndexOf('.')); // hash node shouldn't include file extension
        var key = camelCase ? toCamel(name) : name
        retval[key] = m.require(joined);
        if (callback && typeof(callback) === 'function') {
          callback(null, retval[key]);
        }
      }
    }
  });
  return retval;
};
