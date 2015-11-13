# lodash-namespace
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> A lodash mixin for namespacing objects

This module has a very simple purpose, which is to namespace an object at varying

## Install

```
$ npm install --save lodash-namespace
```


## Usage

```js
var _ = require('lodash-namespace')();

// or, providing your own lodash object
var _ = require('lodash-namespace')(require('lodash'));

var myObj = {};

var myNamespace = _.namespace(myObj, 'hello.world');
//=> {}
console.log(myObj);
//=> {hello: {world: {}}}

console.log(myObj.hello.world === myNamespace);
//=> true

// Or, you can use it to namespace lodash itself, or a wrapped object

var myNamespace = _(myObj).namespace('hello.world');
//=> {}
console.log(myObj);
//=> {hello: {world: {}}}

var myNamespace = _.namespace('hello.world');
//=> {}

console.log(_.hello);
//=> {world: {}}
```


## API

### _.namespace(obj, path);

If `obj` is not provided, it will use either lodash itself, or if it's a wrapped object, it will use that object.

`path` can be any value that you would be able to pass to [get](https://lodash.com/docs#get) or [set](https://lodash.com/docs#set).

## License

MIT © [Nate Cavanaugh](http://alterform.com)

[npm-image]: https://img.shields.io/npm/v/lodash-namespace.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lodash-namespace
[travis-image]: https://img.shields.io/travis/natecavanaugh/lodash-namespace/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/natecavanaugh/lodash-namespace
[coveralls-image]: https://img.shields.io/coveralls/natecavanaugh/lodash-namespace/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/natecavanaugh/lodash-namespace?branch=master