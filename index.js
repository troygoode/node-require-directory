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
      },
      visit: function (obj) {
        return obj;
      }
    };

  function requireDirectory(m, path, options) {
    var retval = {},
      includeFile = null;

    // path is optional
    if (path && !options && !_.isString(path)) {
      options = path;
      path = null;
    }

    // default options
    options = _.defaults(options || {}, defaultOptions);

    // if no path was passed in, assume the equivelant of __dirname from caller
    // otherwise, resolve path relative to the equivalent of __dirname
    if (!path) {
      path = dirname(m.filename);
    } else {
      path = resolve(dirname(m.filename), path);
    }

    includeFile = function (path, filename) {
      // verify file has valid extension
      if (!new RegExp('\\.(' + options.extensions.join('|') + ')$', 'i').test(filename)) {
        return false;
      }

      // if options.include is a RegExp, evaluate it and make sure the path passes
      if (options.include && options.include instanceof RegExp && !options.include.test(path)) {
        return false;
      }

      // if options.include is a function, evaluate it and make sure the path passes
      if (options.include && _.isFunction(options.include) && !options.include(path, filename)) {
        return false;
      }

      // if options.exclude is a RegExp, evaluate it and make sure the path doesn't pass
      if (options.exclude && options.exclude instanceof RegExp && options.exclude.test(path)) {
        return false;
      }

      // if options.exclude is a function, evaluate it and make sure the path doesn't pass
      if (options.exclude && _.isFunction(options.exclude) && options.exclude(path, filename)) {
        return false;
      }

      return true;
    };

    // get the path of each file in specified directory, append to current tree node, recurse
    path = resolve(path);
    fs.readdirSync(path).forEach(function (filename) {
      var joined = join(path, filename),
        files,
        key,
        obj;
      if (fs.statSync(joined).isDirectory() && options.recurse) {
        files = requireDirectory(m, joined, options); // this node is a directory; recurse
        if (Object.keys(files).length) { // exclude empty directories
          retval[options.rename(filename, joined, filename)] = files;
        }
      } else {
        if (joined !== m.filename && includeFile(joined, filename)) {
          key = filename.substring(0, filename.lastIndexOf('.')); // hash node key shouldn't include file extension
          obj = m.require(joined);
          retval[options.rename(key, joined, filename)] = options.visit(obj, joined, filename) || obj;
        }
      }
    });
    return retval;
  }

  module.exports = requireDirectory;
  module.exports.defaults = defaultOptions;

}());

