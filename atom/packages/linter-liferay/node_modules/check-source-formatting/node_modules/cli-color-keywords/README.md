# cli-color-keywords
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

This module mainly only exists because I got tired of re-adding my custom keywords to [chalk](https://www.npmjs.com/package/chalk).
The exported module is a function that creates a chalk object for you with the following keywords added: `bgError`, `bgHelp`, `bgWarn`, `error`, `help`, `subtle`, `warn`, and `ignored`.


## Install

```
$ npm install --save cli-color-keywords
```


## Usage

```js
var colors = require('cli-color-keywords')();

colors.subtle('unicorns');
```


## API

### cliColorKeywords([options])

#### options

Type: `object`

Basically, anything you can pass to the `chalk.constructor` is accepted.


## License

MIT © [Nate Cavanaugh](http://alterform.com)

[npm-image]: https://img.shields.io/npm/v/cli-color-keywords.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cli-color-keywords
[travis-image]: https://img.shields.io/travis/natecavanaugh/cli-color-keywords/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/natecavanaugh/cli-color-keywords
[coveralls-image]: https://img.shields.io/coveralls/natecavanaugh/cli-color-keywords/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/natecavanaugh/cli-color-keywords?branch=master