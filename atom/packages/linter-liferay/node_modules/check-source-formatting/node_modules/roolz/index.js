var _ = require('lodash');

var EventEmitter = require('drip').EnhancedEmitter;

var sub = require('string-sub');

var re = function(rules) {
	EventEmitter.call(this);

	var rulesets = {};

	_.assign(rulesets, rules);

	this.rules = rulesets;
};

re.prototype = _.create(
	EventEmitter.prototype,
	{
		constructor: re,

		getValue: _.get,

		getMessage: function(result, rule, context) {
			var warning;

			var message = rule.message || this.message;

			if (rule.message === false) {
				message = false;
			}

			if (_.isString(message)) {
				warning = this.message(message, result, rule, context);
			}
			else if (_.isFunction(message)) {
				warning = message.call(this, result, rule, context);
			}

			return warning;
		},

		isValidRule: function(ruleName, rule, context) {
			return (ruleName !== 'IGNORE' && ruleName.indexOf('_') !== 0) &&
					(!rule.valid || (_.isFunction(rule.valid) && rule.valid.call(this, rule, context)));
		},

		isValidRuleSet: function(rules, context) {
			var validRuleSet = false;

			if (_.isObject(rules)) {
				var ignore = rules.IGNORE;
				var customIgnore = context.customIgnore;
				var rawContent = context.rawContent;

				validRuleSet = (!ignore || (ignore && !ignore.test(rawContent))) &&
						(!customIgnore || (customIgnore && !customIgnore.test(rawContent)));
			}

			return validRuleSet;
		},

		iterateRules: function(rules, context) {
			var instance = this;

			if (_.isString(rules)) {
				rules = instance.getValue(instance.rules, rules);
			}

			var contentProp = this._getContentProp(context);

			var rawContent = context[contentProp];

			if (instance.isValidRuleSet(rules, context)) {
				_.forEach(
					rules,
					function(rule, ruleName) {
						if (instance.isValidRule(ruleName, rule, context)) {
							var result = instance.testContent(rule, context, rules);

							if (result) {
								var message = instance.getMessage(result, rule, context);

								if (message) {
									instance.emit(
										'message',
										{
											context: context,
											message: message
										}
									);
								}

								rawContent = instance.replaceItem(result, rule, context);
							}
						}
					}
				);
			}

			return rawContent;
		},

		match: function(content, re) {
			return content.match(re);
		},

		message: function(message, result, rule, context) {
			return sub(message, context.lineNum, context.content);
		},

		replaceItem: function(result, rule, context) {
			var replacer = rule.replacer;

			var contentProp = this._getContentProp(context);

			var rawContent = context[contentProp];

			if (replacer) {
				rawContent = this._callReplacer(result, rule, context);

				context[contentProp] = rawContent;
			}

			return rawContent;
		},

		test: function(content, regex) {
			return regex.test(content);
		},

		testContent: function(rule, context, rules) {
			var regex = rule.regex;
			var test = rule.test || this.test;

			if (test === 'match') {
				test = this.match;
			}

			var testProp = _.get(
				_.find(
					[rule, rules, this],
					function(item, index) {
						var testProp = item && item.testProp;

						return testProp && context.hasOwnProperty(testProp);
					}
				),
				'testProp',
				'content'
			);

			var testItem = context[testProp];

			return test.call(this, testItem, regex, rule, context);
		},

		_callReplacer: function(result, rule, context) {
			var contentProp = this._getContentProp(context);

			var rawContent = context[contentProp];
			var replacer = rule.replacer;

			if (_.isString(replacer)) {
				rawContent = rawContent.replace(rule.regex, replacer);
			}
			else if (_.isFunction(replacer)) {
				rawContent = replacer.call(this, result, rule, context);
			}

			return rawContent;
		},

		// TODO: Need to analyze this in regards to the testProp feature.
		// Specifying the testProp will test some other property, but the
		// content that's returned will either be from content or rawContent.

		_getContentProp: function(context) {
			return _.isUndefined(context.rawContent) ? 'content' : 'rawContent';
		}
	}
);

module.exports = re;