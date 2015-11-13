# roolz
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Create rules and do stuff


## Install

```
$ npm install --save roolz
```


## Usage

```js
var roolz = require('roolz');

var ruleEngine = new roolz();

ruleEngine.on(
	'message',
	function(data) {
		console.log(data.message);
		// You can't have upper case letters
		console.log(data.context.content);
		// Hello World
	}
);

ruleEngine.iterateRules(
	{
		noUpperCaseLetters: {
			regex: /[A-Z]/,
			message: "You can't have uppercase letters",
			replacer: function(result, rule, context) {
				return context.content.toLowerCase();
			}
		}
	},
	{
		fullItem: 'Hello World',
		content: 'Hello World'
	}
);
// hello world
```



## API

### `roolz([rules])`

#### rules

*optional*
Type: `Object`

This is the rule object that contains the rules you wish to use.
Passing this object is optional during instantiation, however, it allows you one slight convenience, which is that when you call `.invokeRules`, you can pass the key name of the rule group you wish to run on the context.

This is useful if you wish to set your rules once on the instance and not worry about them again (though you can still also pass additional rule groups to `.iterateRules` at a later time).

### Methods

#### `.iterateRules(rules, context)`

This is the workhorse of the engine, in which you give it a set of rules to run, and a context object.
It will loop over all of the rules defined in the rule group, and validate that the rule applies, and can sends out a message, as well as replace the content (if a `replacer` property is specified on any of the rules).

Returns the `fullItem` property of the context after any transformations or replacements have been added to it.

#### `.message`
This is a utilty method mainly for use when you define a `message` property on a rule object as a function.
In the function you could do something like:

```js
	message: function(result, rule, context) {
		return this.message('Line {0}: Bad input "{1}"', result, rule, context);
	}
```

If `lineNum` is defined in your context, this will output something like:
`Line 71: Bad input "test"`

Returns the string after any defined placeholders are replaced.

#### `.match`
This is a utilty method mainly for use when you define a `test` property on a rule object as a function.
In the function you could do something like:

```js
	test: function(content, regex, rule, context) {
		return this.match(content, regex);
	}
```

Returns the result of running a `.match` on the content (null if nothing is found, or an array of results).

#### `.test`
This is a utilty method mainly for use when you define a `test` property on a rule object as a function.
In the function you could do something like:

```js
	test: function(content, regex, rule, context) {
		return this.test(content, regex);
	}
```

Returns a boolean.

### Rule sets

A rule set is simply a named collection of rule objects. You pass this into the constructor to allow a rule set to be iterated over by name with the `.iterateRules` method.

This would end up looking like:
```js
var ruleEngine = new roolz(
	{
		myRules: {
			checkLines: {...},
			checkWords: {...}
		}
	}
);
```

Then, when you call: `ruleEngine.iterateRules('myRules', context)`, it will iterate over `checkLines` and `checkWords` that were defined.

If a rule set has a property called `IGNORE` on it, it's expected to be a regular expression which, if it passes, will not run any of the rules in the rule set.

### Rule objects
A rule object is simply an object with the following properties:
`regex` (required) Regular Expression
`message` (required) Can either be a string, a function, or a boolean of false if you don't wish to have any message output (this is really only useful if you're replacing something but don't want to output an error - for instance if you're logging out a message for it from something else).
If the message is defined as a string, then it can accept placeholders in the format of `{index}`, which if the supplied value is an array (by default it is), then the index is numeric, but if the value supplied is an object, then it would be the property index that's used.
If it's defined as a function, the `this` context is set to the roolz instance, and the arguments that are passed in are `result` (the result of either `test` or `match`, depending on how the rule is configured; see below), `rule` (the current rule object), and `context`, which is the object passed into `.iterateRules`.

If only those are passed, when `.iterateRules` is called, the `content` property of the context is tested with the regex to make sure it matches, and if it does, the message is emitted as a `message` event.

The other (optional) properties that have special meaning on the rule object are:
`replacer` A string or a function. If passed as a string, it's the same kind of string that you would pass to `str.replace(/foo/, 'bar')`, meaning any groups specified in the regex can be referenced normally, and behaves exactly as if you had called the native `.replace` on a string.
If you pass a function, you need to return the string you wish to use as a replacement, but the function receives different arguments than what you would get if you passed a function to `.replace`.
The arguments are the same as `.message`, in that they are `result`, `rule`, and `context`.

`test` A string or a function. If you pass a string, the only thing it recognizes is the word "match", which tells the engine to use the `.match` method on the string instead of the `.test` method. The impact of using `.match` is on the `result` argument passed to the other functions such as `replacer`. Instead of return a strict boolean of true or false, it returns what `str.match(/foo/)` would return, which is either an array of the matches, or null (if no match is found).
If a function is defined for `test`, then whatever value it returns will be passed as the result to the other functions.
The arguments it receives are `content` (the content to test), `regex` (the rule's regex), `rule` the current rule object, and `context`.

`valid` A function. This property allows you to create a function that can dynamically determine if the rule should even test the content. It should return a boolean, and gets passed the arguments of `rule` and `context`.

`testProp` A string. By default, the regex is tested against the `content` property of the context. However, if you wish to have it test any other property on the context object, without having to implement the `test` property on the rule, you can specify this property and it will be tested on that property if it exists in the context.
**This property can also be set on a rule set, or on the instance itself**. If a property is specified on the rule that doesn't exist on the context, it will check the rule set for a `testProp`, and if one is not set (or doesn't exist on the context), it will lastly look on the instance.

Any other properties, methods, objects, etc can be defined on the rule object, so you don't have to cram all of the logic only in the above functions.

It is recommended that for methods, to prefix the names with `_` and for properties to make the names as all uppercase (as object constants). This limits the possibility that in the future another name could be added that might conflict, but this is only a recommendation.

## License

MIT © [Nate Cavanaugh](http://alterform.com)

[npm-image]: https://img.shields.io/npm/v/roolz.svg?style=flat-square
[npm-url]: https://npmjs.org/package/roolz
[travis-image]: https://img.shields.io/travis/natecavanaugh/roolz/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/natecavanaugh/roolz
[coveralls-image]: https://img.shields.io/coveralls/natecavanaugh/roolz/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/natecavanaugh/roolz?branch=master