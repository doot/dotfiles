var _ = require('lodash');

var colors = require('cli-color-keywords')();

module.exports = function(hb) {
	hb = hb || require('handlebars');

	Object.keys(colors.styles).forEach(
		function(item, index) {
			hb.registerHelper(
				item,
				function(options) {
					return colors[item](options.fn(this));
				}
			);
		}
	);

	hb.registerHelper(
		'color',
		function(options) {
			var colorStyle = this.type;

			if (!_.isFunction(colors[colorStyle])) {
				colorStyle = 'warn';
			}

			return colors[colorStyle](options.fn(this));
		}
	);

	hb.registerHelper(
		'line',
		function(options) {
			var line = this.line;
			var text = 'Line';

			if (Array.isArray(line)) {
				line = line.join('-');
				text = 'Lines';
			}

			if (this.column && options.data.root.showColumns) {
				line += ', Column ' + this.column;
			}

			return text + ' ' + line;
		}
	);

	hb.registerHelper(
		'and',
		function(a, b, options) {
			var retVal;

			if (a && b) {
				retVal = options.fn(this);
			}
			else {
				retVal = options.inverse(this);
			}

			return retVal;
		}
	);

	hb.registerHelper(
		'banner',
		function(options) {
			var content = options.fn(this);

			if (!this.showBanner) {
				content = '';
			}

			return content;
		}
	);

	return hb;
};