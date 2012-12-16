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
module.exports = requireDirectory(module, __dirname);
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

### Usage + Blacklist Regex

Using the same directory structure from above:

```javascript
var excludeLogout = /logout.js$/;
var requireDirectory = require('require-directory');
var routes = requireDirectory(module, './routes/', excludeLogout);

// snip

app.get '/', routes.home;
app.get '/register', routes.auth.register;
app.get '/login', routes.auth.login;
//app.get '/logout', routes.auth.logout; //<-- not present
```

### Usage + Path-checking Delegate

Using the same directory structure from above:

```javascript
var excludeLogout = function(path){
  if(/routes\/auth\/logout.js$/.test(path)){
    return false;
  }else{
    return true;
  }
};
var requireDirectory = require('require-directory');
var routes = requireDirectory(module, './routes/', excludeLogout);

// snip

app.get '/', routes.home;
app.get '/register', routes.auth.register;
app.get '/login', routes.auth.login;
//app.get '/logout', routes.auth.logout; //<-- not present
```

## Run Unit Tests

```bash
$ npm test
```

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Troy Goode](https://github.com/TroyGoode) ([troygoode@gmail.com](mailto:troygoode@gmail.com))
