var assert = require('assert');
var reqdir = require('../index');

suite('require-directory', function(){
  suite('#', function(){
    test('should work', function(){
      //arrange
      //act
      var test = reqdir(module, './test/example'); //path is slight weird because of mocha's module scoping

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('foo2!', test.foo2);
      assert.equal('baz!', test.bar.baz);
    });

    test('should take an optional delegate', function(){
      //arrange
      var delegate = function(path){
        if(/foo2.js$/.test(path)){
          return false;
        }else{
          return true;
        }
      };

      //act
      var test = reqdir(module, './test/example', delegate); //path is slight weird because of mocha's module scoping

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.foo2);
      assert.equal('baz!', test.bar.baz);
    });
  });
});
