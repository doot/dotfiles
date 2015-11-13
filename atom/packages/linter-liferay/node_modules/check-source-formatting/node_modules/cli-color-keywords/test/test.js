'use strict';
var colors = require('../');
var chalk = require('chalk');
var _ = require('lodash');

var chai = require('chai');

chai.use(require('chai-string'));

var assert = chai.assert;

it(
	'should have custom keywords',
	function() {
		var ctx = colors();

		['bgError', 'bgHelp', 'bgWarn', 'error', 'help', 'subtle', 'warn', 'ignored'].forEach(
			function(item, index) {
				assert.isTrue(ctx.hasOwnProperty(item), 'Object should have a method called ' + item);
				assert.isTrue(_.isFunction(ctx[item]), 'The property named ' + item + ' should be a function');
			}
		);
	}
);