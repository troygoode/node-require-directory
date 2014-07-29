(function () {
  'use strict';

  var _ = require('underscore'),
    fs = require('fs'),
    join = require('path').join,
    resolve = require('path').resolve,
    dirname = require('path').dirname,
    defaultOptions = {
      extensions: ['js', 'json', 'coffee'],
      recurse: true,
      rename: function (name) {
        return name;
      }
    };

  function requireDirectory(m, path, options) {
    var defaultDelegate = function (path, filename) {
        return filename[0] !== '.' && /\.(js|json|coffee)$/i.test(filename);
      },
      delegate = defaultDelegate,
      retval = {};

    // default options
    options = _.defaults(options || {}, defaultOptions);

    // if no path was passed in, assume the equivelant of __dirname from caller
    // otherwise, resolve path relative to the equivalent of __dirname
    if (!path) {
      path = dirname(m.filename);
    } else {
      path = resolve(dirname(m.filename), path);
    }

    // if a RegExp was passed in as exclude, create a delegate that blacklists that RegExp
    // if a function was passed in as exclude, use that function as the delegate
    // default to an always-yes delegate
    if (options.include instanceof RegExp) {
      delegate = function (path, filename) {
        if (!defaultDelegate(path, filename)) {
          return false;
        } else if (options.include.test(path)) {
          return true;
        } else {
          return false;
        }
      };
    } else if (options.include && {}.toString.call(options.include) === '[object Function]') {
      delegate = options.include;
    }

    // get the path of each file in specified directory, append to current tree node, recurse
    path = resolve(path);
    fs.readdirSync(path).forEach(function (filename) {
      var joined = join(path, filename);
      if (fs.statSync(joined).isDirectory() && options.recurse) {
        var files = requireDirectory(m, joined, options); // this node is a directory; recurse
        if (Object.keys(files).length) {
          retval[options.rename(filename)] = files;
        }
      } else {
        if (joined !== m.filename && delegate(joined, filename)) {
          var name = filename.substring(0, filename.lastIndexOf('.')), // hash node shouldn't include file extension
            obj = m.require(joined);
          if (options.visit && typeof(options.visit) === 'function') {
            retval[options.rename(name)] = options.visit(obj) || obj;
          } else {
            retval[options.rename(name)] = obj;
          }
        }
      }
    });
    return retval;
  }

  module.exports = requireDirectory;
  module.exports.defaults = defaultOptions;

}());

