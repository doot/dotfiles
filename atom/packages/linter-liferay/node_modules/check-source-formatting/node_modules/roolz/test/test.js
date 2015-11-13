'use strict';
var _ = require('lodash');
var roolz = require('../');

var sinon = require('sinon');
var chai = require('chai');

chai.use(require('chai-string'));

var assert = chai.assert;

describe(
	're.js',
	function() {
		'use strict';

		var sandbox;

		var sharedRules;

		beforeEach(
			function() {
				sandbox = sinon.sandbox.create();

				sharedRules = {
					ruleTest: {
						logging: {
							message: 'Found foo: {1}',
							regex: /foo/
						}
					}
				};
			}
		);

		afterEach(
			function() {
				sandbox.restore();
			}
		);

		it(
			'should iterate rules properly',
			function() {
				var rulesObject = sharedRules;

				var ruleInstance = new roolz(rulesObject);

				var logger = sandbox.spy();

				ruleInstance.on('message', logger);

				var content = ruleInstance.iterateRules(
					'ruleTest',
					{
						file: 'foo.js',
						content: 'test foo test'
					}
				);

				assert.isTrue(logger.called);
				assert.equal(content, 'test foo test');

				content = ruleInstance.iterateRules(
					'ruleTest',
					{
						file: 'foo.js',
						rawContent: 'test rawContent test',
						content: 'test foo test'
					}
				);

				assert.equal(content, 'test rawContent test');
			}
		);

		it(
			'should iterate rules with a string path',
			function() {
				var rulesObject = {
					topRuleGroup: [sharedRules]
				};

				var ruleInstance = new roolz(rulesObject);

				var logger = sandbox.spy();

				ruleInstance.on('message', logger);

				var content = ruleInstance.iterateRules(
					'topRuleGroup[0].ruleTest',
					{
						file: 'foo.js',
						content: 'test foo test'
					}
				);

				assert.isTrue(logger.called);
				assert.equal(content, 'test foo test');
			}
		);

		it(
			'should iterate rules from an object reference',
			function() {
				var rulesObject = sharedRules;

				var ruleInstance = new roolz(rulesObject);

				var logger = sandbox.spy();

				ruleInstance.on('message', logger);

				var content = ruleInstance.iterateRules(
					rulesObject.ruleTest,
					{
						file: 'foo.js',
						content: 'test foo test'
					}
				);

				assert.isTrue(logger.called);
				assert.equal(content, 'test foo test');
			}
		);

		it(
			'should trim line by default',
			function() {
				sharedRules.ruleTest.logging.replacer = true;

				var ruleInstance = new roolz(sharedRules);

				var logger = sandbox.spy();

				ruleInstance.on('message', logger);

				var content = ruleInstance.iterateRules(
					'ruleTest',
					{
						file: 'foo.js',
						content: ' test foo test '
					}
				);

				assert.isTrue(logger.calledOnce);
				assert.equal(content, ' test foo test ');
			}
		);

		it(
			'should not iterate non-existant rules',
			function() {
				var ruleInstance = new roolz({});

				var logger = sandbox.spy();

				var content = ruleInstance.iterateRules(
					'nonExistantRules',
					{
						file: 'foo.js',
						content: 'test foo test',
						logger: logger
					}
				);

				assert.isTrue(logger.notCalled);
				assert.equal(content, 'test foo test');
			}
		);

		it(
			'should not iterate ignored lines',
			function() {
				var ruleInstance = new roolz(
					{
						ignoredRuleTest: {
							IGNORE: /^\t/,
							logging: {
								message: 'Found foo: {1}',
								regex: /foo/
							}
						}
					}
				);

				var logger = sandbox.spy();

				var contentString = '	test foo test';

				var content = ruleInstance.iterateRules(
					'ignoredRuleTest',
					{
						file: 'foo.js',
						content: contentString,
						logger: logger
					}
				);

				assert.isTrue(logger.notCalled);
				assert.equal(content, contentString);
			}
		);

		it(
			'should get the value from an object properly',
			function() {
				var ruleInstance = new roolz({});

				var obj = {
					foo: {
						bar: 1
					}
				};

				var value = ruleInstance.getValue(obj, 'foo.bar');

				assert.equal(value, 1);

				value = ruleInstance.getValue(obj, ['foo', 'bar']);

				assert.equal(value, 1);
			}
		);

		it(
			'should get not output a message when a rules message is false',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						message: false,
						replacer: true
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var logger = sandbox.spy();

				ruleInstance.on('message', logger);

				var content = ruleInstance.iterateRules(
					'ruleTest',
					{
						file: 'foo.js',
						content: 'test foo test'
					}
				);

				assert.isTrue(logger.notCalled);
			}
		);

		it(
			'should allow a message to be a function',
			function() {
				var message = sandbox.stub().returns('Hello');

				_.assign(
					sharedRules.ruleTest.logging,
					{
						message: message,
						replacer: true
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var logger = sandbox.spy();

				ruleInstance.on('message', logger);

				var content = ruleInstance.iterateRules(
					'ruleTest',
					{
						file: 'foo.js',
						content: 'test foo test'
					}
				);

				assert.isTrue(message.called);

				var spyCallArgs = logger.firstCall.args;
				assert.equal(spyCallArgs[0].message, 'Hello');
			}
		);

		it(
			'should test a rule with match instead of test',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						test: 'match'
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var content = ruleInstance.testContent(
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						content: 'test foo test'
					}
				);

				assert.isTrue(Array.isArray(content));
				assert.equal(content[0], 'foo');
			}
		);

		it(
			'should be able to test a rule with a custom property',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						testProp: 'rawContent'
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var content = ruleInstance.testContent(
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						rawContent: 'test foo test',
						content: ''
					}
				);

				assert.isTrue(content);
			}
		);

		it(
			'should ignore invalid testProp',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						testProp: 'someProp'
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var content = ruleInstance.testContent(
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						rawContent: 'test foo test',
						content: ''
					}
				);

				assert.isFalse(content);
			}
		);

		it(
			'should fallback to valid testProp when invalid testProp passed',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						testProp: 'someProp'
					}
				);

				sharedRules.ruleTest.testProp = 'someOtherProp';

				var ruleInstance = new roolz(sharedRules);

				var content = ruleInstance.testContent(
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						someOtherProp: 'test foo test',
						content: ''
					},
					sharedRules.ruleTest
				);

				assert.isTrue(content);

				delete sharedRules.ruleTest.testProp;

				ruleInstance = new roolz(sharedRules);

				ruleInstance.testProp = 'aNewProp';

				var content = ruleInstance.testContent(
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						aNewProp: 'test foo test',
						content: ''
					}
				);

				assert.isTrue(content);
			}
		);

		it(
			'should accept a string as the replacer',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						regex: /foo(.*)/,
						replacer: '$1tender'
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var content = ruleInstance.replaceItem(
					true,
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						content: 'foobar'
					}
				);

				assert.equal(content, 'bartender');
			}
		);

		it(
			'should accept a function as the replacer',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						regex: /foo(.*)/,
						replacer: function(result, rule, context) {
							return context.rawContent.replace(rule.regex, '$1tender');
						}
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var content = ruleInstance.replaceItem(
					true,
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						rawContent: 'foobar',
						content: 'foobar'
					}
				);

				assert.equal(content, 'bartender');
			}
		);

		it(
			'ignore invalid rules',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						regex: /foo(.*)/,
						replacer: function(result, rule, context) {
							return context.rawContent.replace(rule.regex, '$1tender');
						},
						valid: function(rule, context) {
							return false;
						}
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var validFn = ruleInstance.isValidRule(
					'logging',
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						rawContent: 'foobar',
						content: 'foobar'
					}
				);

				assert.isFalse(validFn);

				var validName = ruleInstance.isValidRule(
					'_logging',
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						rawContent: 'foobar',
						content: 'foobar'
					}
				);

				assert.isFalse(validName);

				_.assign(
					sharedRules.ruleTest.logging,
					{
						valid: false
					}
				);

				var validBool = ruleInstance.isValidRule(
					'_logging',
					sharedRules.ruleTest.logging,
					{
						file: 'foo.js',
						rawContent: 'foobar',
						content: 'foobar'
					}
				);

				assert.isFalse(validBool);
			}
		);

		it(
			'ignore unmatched rules',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						regex: /blah/,
						replacer: 'test'
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var content = ruleInstance.iterateRules(
					'ruleTest',
					{
						file: 'foo.js',
						content: 'foobar'
					}
				);

				assert.equal(content, 'foobar');
			}
		);

		it(
			'ignore invalid rulesets',
			function() {
				_.assign(
					sharedRules.ruleTest.logging,
					{
						regex: /foo(.*)/,
						replacer: function(result, rule, context) {
							return context.rawContent.replace(rule.regex, '$1tender');
						},
						valid: function(rule, context) {
							return false;
						}
					}
				);

				var ruleInstance = new roolz(sharedRules);

				var ruleSet = _.assign({}, sharedRules.ruleTest);

				var customIgnore = ruleInstance.isValidRuleSet(
					ruleSet,
					{
						file: 'foo.js',
						rawContent: 'foobar',
						content: 'foobar',
						customIgnore: /^foo/
					}
				);

				assert.isFalse(customIgnore);

				var logger = sandbox.spy();

				ruleInstance.on('message', logger);

				var content = ruleInstance.iterateRules(
					'ruleTest',
					{
						file: 'foo.js',
						rawContent: 'foobar',
						content: 'foobar'
					}
				);

				assert.isTrue(logger.notCalled);
				assert.equal(content, 'foobar');
			}
		);
	}
);