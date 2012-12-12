var assert = require('assert');
var reqdir = require('../index');

suite('require-directory', function(){
  suite('#', function(){
    test('should work', function(){
      //arrange/act
      var test = reqdir(module, './test/example'); //path is slight weird because of mocha's module scoping

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('baz!', test.bar.baz);
    });
  });
});
