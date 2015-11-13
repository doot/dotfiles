# Content Formatter
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> A base module with which to create a custom file formatter.

This module is fairly simple, and on it's own, doesn't do much. However, it allows you to therefore do *anything*.
A base formatter has a very simple API, which is a `format` method and a `log` method.
Why would you want this sort of thing? Mainly, we're using it as a piece of our [check-source-formatter](http://github.com/natecavanaugh/check-source-formatting) module and our [convert-bootstrap-2-to-3](http://github.com/natecavanaugh/convert-bootstrap-2-to-3) module.

## Install

```
$ npm install --save content-formatter
```


## Usage

### Creating a formatter

```js
var Formatter = require('content-formatter');

var JSFormatter = Formatter.create({
	includes: /\.js$/,
	id: 'JS'
});

var jsFormatter = new JSFormatter('test.js');

var fs = require('fs');
var contents = fs.readFileSync('test.js');

var newContents = jsFormatter.format(contents);
```

One thing you may notice in the above example is that you need to handle reading the content on your own. This is so that you have more flexibility on where your content comes from (perhaps you're reading from a database, or some other data source).

`Formatter.create` takes an object that, at the bare minimum, requires only 2 properties: `includes` and `id`.

This method returns the constructor of your custom formatter.

You can think of `includes` as the test that gets run over what ever path you pass into the constructor (and in the same way that the path could be anything, the `includes` could also be any sort of test for that path).
This allows you to specify that you want your formatter to only run on certain types of data.

Also of note, in addition to `includes`, you can also pass an `excludes` regex, which will allow you to negate the `includes` regex. This is useful to filter out items where JavaScript's regex is more limited.
For instance, if you wanted to include all `.js` files, but exclude any minified files, you could do something like
```js
Formatter.create({
	includes: /\.js$/,
	excludes: /[_.-]min\.js$/,
	id: 'JS'
});
```

However, just using those two properties doesn't give you much by way of functionality.

So the other properties you can pass into `Formatter.create` are `constructor` (this will be used as the constructor of your formatter, instead of the default one) and `prototype`, which is an object you can add the instance methods of your formatter on.

So, for instance:
```js
var Formatter = require('content-formatter');

var JSFormatter = Formatter.create({
	includes: /\.js$/,
	id: 'JS'
	constructor: function() {
		console.log('This is a constructor');

		// Make sure to include this, or stuff will go wrong
		return Formatter.apply(this, arguments);
	},
	prototype: {
		// define your custom formatter
		format: function(contents) {
			if (contents.indexOf('#!') === 0) {
				// this is a shell script
				this.log(1, 'This is a shell script');
			}
			else {
				contents = contents.toLowerCase();
			}

			return contents;
		}
	}
});

var jsFormatter = new JSFormatter('test.js');
// 'This is a constructor'

console.log(jsFormatter.format('FOO_BAR'));
// 'foo_bar'

console.log(jsFormatter.format('#! /usr/bin/env node'));
// 'This is a shell script'
// '#! /usr/bin/env node'
```

This may seem like a really verbose way to handle such a simple use case, but this module is mainly designed as a base API layer to enforce a certain contract.

If you do not wish to pass a `constructor`, but yet want to have a method called when you instantiate the object (for instance, if the pomp and circumstance of always having to do `return Formatter.apply(this, arguments);` get's old), then you can define an `init` method on the `prototype` object, and when you call `new formatter('foo.js')`, it will be called with the same arguments passed into the constructor.


### Getting the appropriate formatter
Let's say you have a bunch of formatters defined in your code, but don't want to check each one manually to see if it should format the contents of the path.
`Formatter.get` is a static method that will loop through all registered formatters and return to you an instance of the first one that passes the `includes` test.
It accepts all of the arguments that a normal `Formatter` constructor would have, but it instantiates the class for you, and gives you back that instance.

For example, using the module from above:

```js
var Formatter = require('content-formatter');

var jsFormatter = Formatter.get('test.js');
jsFormatter.format(contents);
```

## API

### `Formatter` constructor

```js
new Formatter(path, [logger, flags])
```

The constructor of the `Formatter` expects to take a path, and optionally, a custom logger can be passed, as well as flags to the formatter.
The only flag that is currently used (by `Formatter.get`), is `force`, which will force the formatter to run, even if the `excludes` tell it not to.

### `Formatter.prototype.format`

This is the powerhouse of the formatter, and it's wide open for you to do anything with it.
You can delegate to other methods, and do anything you please.
By default, it expects a string of contents, and to return new contents (though, your implementation could always allow for a callback to be passed that could return the new contents).

### `Formatter.prototype.log`
This is the basic logging method. If no custom logger was passed in, it will default to `Formatter.DEFAULT_LOGGER`, which, by default, is set to `console`.
However, `Formatter.DEFAULT_LOGGER` can be passed any object that has a `log` method on it.
By default, the log method takes the following arguments:

```js
jsFormatter.log(line, msg, [type, props]);
```
What's eventually passed to the internal logger though, is the following:
`line, msg, path, type, props`

Your implementation can overwrite this, and send whatever it likes, but we use this most commonly with logging out which line is causing an issue. But again, that's just the defaults.



###

## TODO
- I'm currently thinking through a way for multiple formatters to run, instead of having it be only one per include type.
- I would like to also remove the requirement of passing an ID for a formatter. If multiple filters eventually can run, it's pointless to have an ID (even now, I think it isn't really needed).

## License

MIT © [Nate Cavanaugh](http://alterform.com)

[npm-image]: https://img.shields.io/npm/v/content-formatter.svg?style=flat-square
[npm-url]: https://npmjs.org/package/content-formatter
[travis-image]: https://img.shields.io/travis/natecavanaugh/content-formatter/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/natecavanaugh/content-formatter
[coveralls-image]: https://img.shields.io/coveralls/natecavanaugh/content-formatter/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/natecavanaugh/content-formatter?branch=master