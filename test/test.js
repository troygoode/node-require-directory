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
      assert.deepEqual({should:'be'}, test.bun);
    });

    test('should take an optional delegate function', function(){
      //arrange
      var delegate = function(path, filename){
        if(/foo2.js$/.test(path) || filename[0] === '.'){
          return false;
        }else{
          return true;
        }
      };

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, delegate);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.foo2);
      assert.equal('baz!', test.bar.baz);
    });

    test('should take an optional regex blacklist definition', function(){
      //arrange
      var blacklist = /foo2.js$/;

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, blacklist);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.foo2);
      assert.equal('baz!', test.bar.baz);
    });

    test('should exclude an empty directory', function(){
      //act
      var test = reqdir(module, PATH_TO_EXAMPLE);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal(undefined, test.empty);
    });

    test('should exclude directory only matching blacklist', function(){
      //arrange
      var blacklist = /baz.js$/;

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, blacklist);

      //assert
      assert.equal('foo!', test.foo);
      assert.equal('foo2!', test.foo2);
      assert.equal(undefined, test.bar);
    });

    test('index should exclude itself', function(){
      //act
      var index = require('./example/index');

      //assert
      assert.equal('foo!', index.foo);
      assert.equal(undefined, index.index);
    });

    test('should take an optional camelCase boolean', function() {
      //arrange
      var camelCase = true;

      //act
      var test = reqdir(module, PATH_TO_EXAMPLE, null, true);

      //assert
      assert.equal('already camel!', test.camelCase.alreadyCamelCase);
      assert.equal('spinal!', test.camelCase.spinalCase);
      assert.equal('snake!', test.camelCase.snakeCase);
    });

    test('should take an optional callback', function(done) {
    	//arrange
    	var callback = function(err, mod) {
    		var result = mod();
    		//assert
    		assert.equal('gone and done it', result);
    		done();
    	};
    	var path = PATH_TO_EXAMPLE + '/fun';

    	//act
    	reqdir(module, path, null, null, callback);
    });
  });
});
