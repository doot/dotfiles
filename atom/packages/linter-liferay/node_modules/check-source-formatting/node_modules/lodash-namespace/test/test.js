'use strict';
var namespace = require('../');

var lodash = namespace(require('lodash'));

var _ = namespace();

var sinon = require('sinon');
var chai = require('chai');

chai.use(require('chai-string'));

var assert = chai.assert;

it(
	'should return a new lodash object if undefined',
	function() {
		assert.notEqual(lodash, _);
	}
);

it(
	'should namespace objects correctly',
	function() {
		var obj1 = {};
		var obj2 = {};

		var value1 = _.namespace(obj1, 'foo.bar');
		var value2 = _.namespace(obj2, ['baz', 'bah']);

		assert.isObject(value1);
		assert.lengthOf(Object.keys(value1), 0);
		assert.deepProperty(obj1, 'foo.bar');

		assert.isObject(value2);
		assert.lengthOf(Object.keys(value2), 0);
		assert.deepProperty(obj2, 'baz.bah');

		var obj3 = {};

		var value7 = _.namespace(obj3, 'boo[0].baz.foo');

		assert.isObject(value7);
		assert.isTrue(Array.isArray(obj3.boo));
		assert.lengthOf(obj3.boo, 1);
		assert.deepProperty(obj3.boo[0], 'baz.foo');

		var value3 = _.namespace('boo.far');

		assert.isObject(value3);
		assert.lengthOf(Object.keys(value3), 0);
		assert.deepProperty(_, 'boo.far');

		var obj4 = {};
		var value4 = _.namespace(obj4, 'foo.bar');
		var value5 = _.namespace(obj4, 'foo.bar');

		assert.equal(value4, value5, 'value4 should be the same object as value5');
	}
);