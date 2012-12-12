var assert = require('assert');
var reqdir = require('../index');
var PATH_TO_EXAMPLE = './test/example'; //path is slight weird because of mocha's module scoping

suite('require-directory', function(){
  suite('#', function(){
    test('should work', function(){
      //arrange
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('foo2!', test.foo2);
      assert.equal('baz!', test.bar.baz);
    });

    test('should take an optional delegate function', function(){
      //arrange
      var delegate = function(path){
        if(/foo2.js$/.test(path)){
          return false;
        }else{
          return true;
        }
      };

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, delegate); //path is slight weird because of mocha's module scoping

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.foo2);
      assert.equal('baz!', test.bar.baz);
    });

    test('should take an optional regex blacklist definition', function(){
      //arrange
      var blacklist = /foo2.js$/;

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, blacklist); //path is slight weird because of mocha's module scoping

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.foo2);
      assert.equal('baz!', test.bar.baz);
    });
  });
});
