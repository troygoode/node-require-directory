# require-directory

Recursively iterates over specified directory, requiring each file, and returning a nested hash structure containing those libraries.

## How To Use

### Installation

```bash
$ npm install require-directory
```

### Usage (as Index)

A common pattern in node.js is to include an index file which creates a hash of the files in its current directory. Given a directory structure like so:

* app.js
* routes/index.js
* routes/home.js
* routes/auth/login.js
* routes/auth/logout.js
* routes/auth/register.js

`index.js` uses `require-directory` to build the hash rather than doing so manually:

```javascript
var requireDirectory = require('require-directory');
module.exports = requireDirectory(module);
```

`app.js` references `routes/index.js` like any other module, but it now has a hash/tree of the exports from the `./routes/` directory:

```javascript
var routes = require('./routes');

// snip

app.get '/', routes.home;
app.get '/register', routes.auth.register;
app.get '/login', routes.auth.login;
app.get '/logout', routes.auth.logout;
```

*Note that `routes.index` will be `undefined` as you would hope.*

### Specifying a Directory

You can specify which directory you want to build a tree of (if it isn't the current directory for whatever reason) by passing it as a second option:

```javascript
var requireDirectory = require('require-directory');
module.exports = requireDirectory(module);
```

### Blacklisting/Whitelisting

`require-directory` takes an optional third parameter that defines which files that should not be included in the hash/tree via either a RegExp or a function. If you pass a function in, it should take a single argument (the path to a file) and return true if that file should be included in the tree. If you pass a RegExp it will be considered a blacklist - files that match that RegExp will **not** be included in the tree:

```javascript
var blacklist = /dontinclude.js$/;
var requireDirectory = require('require-directory');
var hash = requireDirectory(module, __dirname, blacklist);
```

```javascript
var check = function(path){
  if(/dontinclude.js$/.test(path)){
    return false; // don't include
  }else{
    return true; // go ahead and include
  }
};
var requireDirectory = require('require-directory');
var hash = requireDirectory(module, __dirname, check);
```

## Run Unit Tests

```bash
$ npm test
```

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Troy Goode](https://github.com/TroyGoode) ([troygoode@gmail.com](mailto:troygoode@gmail.com))
