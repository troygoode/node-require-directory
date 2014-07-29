/* global suite:true, test:true */
(function () {
  'use strict';

  var assert = require('assert'),
    reqdir = require('../index'),
    PATH_TO_EXAMPLE = './example';

  suite('require-directory', function () {
    test('should work with JS', function () {
      //arrange
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('foo2!', test.foo2);
    });

    test('should work with JSON', function () {
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('be', test.bun.should);
    });

    test('should be able to specify supported extensions', function () {
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, {extensions: ['json']});

      //assert
      assert.equal(undefined, test.foo);
      assert.equal('be', test.bun.should);
    });

    test('should work with nested folders', function () {
      //arrange
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('baz!', test.bar.baz);
    });

    test('should be able to disable recursion', function () {
      //arrange
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, {recurse: false});

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.bar);
    });

    test('should work with empty folder', function () {
      //arrange
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE + '/empty');

      //assert
      assert.equal(0, Object.keys(test).length); // should be an empty object: {}
    });

    test('should take an optional whitelist function', function () {
      //arrange
      var delegate = function (path) {
        return !(/foo2.js$/.test(path)) && /\.js$/.test(path);
      };

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, {include: delegate});

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.foo2);
      assert.equal('baz!', test.bar.baz);
    });

    test('should take an optional regex whitelist definition', function () {
      //arrange
      var whitelist = /(foo|foo2).js$/;

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, {include: whitelist});

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('foo2!', test.foo2);
      assert.equal(undefined, test.bun);
    });

    test('should take an optional blacklist function', function () {
      //arrange
      var delegate = function (path) {
        return (/foo2.js$/.test(path)) && /\.js$/.test(path);
      };

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, {exclude: delegate});

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.foo2);
      assert.equal('baz!', test.bar.baz);
    });

    test('should take an optional regex blacklist definition', function () {
      //arrange
      var blacklist = /bun\.json$/;

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, {exclude: blacklist});

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('foo2!', test.foo2);
      assert.equal(undefined, test.bun);
    });

    test('should exclude an empty directory', function () {
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.empty);
    });

    test('should exclude directory with no files on matching whitelist', function () {
      //arrange
      var whitelist = /foo.js$/;

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, {include: whitelist});

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.bar);
    });

    test('index should exclude itself', function () {
      //act
      var index = require('./example/index');

      //assert
      assert.equal('foo!', index.foo);
      assert.equal(undefined, index.index);
    });

    test('should take an optional visitor function', function () {
      //arrange
      var visitor = function (obj) {
          //assert
          assert.equal('gone and done it', obj());
        },
        path = PATH_TO_EXAMPLE + '/fun';

      //act
      reqdir(module, path, {visit: visitor});
    });

    test('visitor function should be able to modify object', function () {
      //arrange
      var visitor = function () {
          return 'modified';
        },
        path = PATH_TO_EXAMPLE + '/fun';

      //act
      var test = reqdir(module, path, {visit: visitor});

      //assert
      assert.equal('modified', test.do);
    });

    test('should be able to rename keys', function () {
      //arrange
      var nameVisitor = function (name) {
          return name.toUpperCase();
        },
        path = PATH_TO_EXAMPLE;

      //act
      var test = reqdir(module, path, {rename: nameVisitor});

      //assert
      assert.equal('foo!', test.FOO);
    });

    test('should resolve path relative to __dirname', function () {
      //arrange
      //act
      var bar = reqdir(module, './example/bar'),
        fun = reqdir(module, './example/fun'),
        funResult = fun.do();

      //assert
      assert.equal('baz!', bar.baz);
      assert.equal('gone and done it', funResult);
    });
  });

}());

