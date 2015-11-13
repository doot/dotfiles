'use strict';
var Handlebars = require('../')();

var colors = require('cli-color-keywords')();

var sinon = require('sinon');
var chai = require('chai');

chai.use(require('chai-string'));

var assert = chai.assert;

var colorStyles = Object.keys(colors.styles);

it(
	'should have explicitly defined helpers available',
	function() {
		'banner and line color'.split(' ').forEach(
			function(item, index) {
				assert.isTrue(item in Handlebars.helpers);
			}
		);
	}
);

it(
	'should have dynamically defined helpers available',
	function() {
		colorStyles.forEach(
			function(item, index) {
				assert.isTrue(item in Handlebars.helpers);
			}
		);
	}
);

it(
	'handle banner',
	function() {
		var banner = '{{#banner}}Hello{{/banner}}';

		var tpl = Handlebars.compile(banner);

		assert.equal(tpl({showBanner: true}), 'Hello');
		assert.equal(tpl({showBanner: false}), '');
	}
);

it(
	'handle and',
	function() {
		var and = '{{#and foo bar}}Hello{{/and}}';

		var tpl = Handlebars.compile(and);

		assert.equal(tpl({bar: true, foo: true}), 'Hello');
		assert.equal(tpl({bar: false, foo: true}), '');
		assert.equal(tpl({bar: true, foo: false}), '');
	}
);

it(
	'handle line',
	function() {
		var line = '{{line}}';

		var tpl = Handlebars.compile(line);

		assert.equal(tpl({line: 1}), 'Line 1');
		assert.equal(tpl({line: [1, 5]}), 'Lines 1-5');
		assert.equal(tpl({line: 1, column: 1, showColumns: true}), 'Line 1, Column 1');
	}
);

it(
	'handle color',
	function() {
		var color = '{{#color}}Hello{{/color}}';

		var tpl = Handlebars.compile(color);

		assert.equal(tpl({type: 'warn'}), colors.warn('Hello'));
		assert.equal(tpl({type: 'subtle'}), colors.subtle('Hello'));
		assert.equal(tpl({type: 'foo'}), colors.warn('Hello'));
	}
);

it(
	'handle dynamically defined color',
	function() {
		colorStyles.forEach(
			function(item, index) {
				var color = '{{#' + item + '}}Hello{{/' + item + '}}';

				var tpl = Handlebars.compile(color);

				assert.equal(tpl(), colors[item]('Hello'));
			}
		);
	}
);