var assert = require('assert');

suite('require-directory', function(){
  suite('#', function(){
    test('should work', function(){
      var reqdir = require('./index');
      var test = reqdir('./test/');
      console.log(test);
      assert.equal('foo!', test.foo);
      assert.equal('baz!', test.bar.baz);
    });
  });
});
