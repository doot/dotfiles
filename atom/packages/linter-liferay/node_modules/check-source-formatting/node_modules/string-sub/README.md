# string-sub [![Build Status](https://travis-ci.org/natecavanaugh/string-sub.svg?branch=master)](https://travis-ci.org/natecavanaugh/string-sub)

> Super lightweight string substitution module.

This module is a very simple string substitution module that allows for either key names, or index positions as the placeholder.

## Install

```
$ npm install --save string-sub
```


## Usage

### Basic usage

```js
var sub = require('string-sub');

sub('Hello {0}!', 'world');
// => Hello world!
```

### Using variable arguments

```js
sub('Hello {0}, {1}!', 'world', 'nice to meet you');
// => Hello world, nice to meet you!
```

### Using objects

```js
sub('Hello {subject}, {greeting}!', {greeting: 'nice to meet you', subject: 'world'});
// => Hello world, nice to meet you!
```

### Using arrays

```js
sub('Hello {0}, {1}!', ['world', 'nice to meet you']);
// => Hello world, nice to meet you!
```



## License

MIT © [Nate Cavanaugh](http://alterform.com)