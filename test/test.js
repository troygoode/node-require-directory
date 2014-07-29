/* global suite:true, test:true */
(function () {
  'use strict';

  var assert = require('assert'),
    reqdir = require('../index'),
    PATH_TO_EXAMPLE = './test/example'; //path is slight weird because of mocha's module scoping

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

    test('should take an optional delegate function', function () {
      //arrange
      var delegate = function (path, filename) {
        if (/foo2.js$/.test(path) || filename[0] === '.') {
          return false;
        } else {
          return true;
        }
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

    test('should take an optional callback', function (done) {
      //arrange
      var callback = function (err, mod) {
          var result = mod();
          //assert
          assert.equal('gone and done it', result);
          done();
        },
        path = PATH_TO_EXAMPLE + '/fun';

      //act
      reqdir(module, path, {visit: callback});
    });
  });

}());

