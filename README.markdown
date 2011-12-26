# require-directory

Recursively iterates over specified directory, requiring each file, and returning a nested hash structure containing those libraries.

## How To Use

### Installation

```bash
$ npm install require-directory
```

### Usage

Given a directory structure like so:

* app.js
* routes/home.js
* routes/auth/login.js
* routes/auth/logout.js
* routes/auth/register.js

```javascript
var requireDirectory = require('require-directory');
var routes = requireDirectory('./routes/');

// snip

app.get '/', routes.home;
app.get '/register', routes.auth.register;
app.get '/login', routes.auth.login;
app.get '/logout', routes.auth.logout;
```

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Troy Goode](https://github.com/TroyGoode) ([troygoode@gmail.com](mailto:troygoode@gmail.com))
