var _ = require('lodash');
var chalk = require('chalk');

var color = function(options) {
	options = options || {};

	/* istanbul ignore next */
	if (process.argv.slice(2).indexOf('--display-raw') > -1) {
		options.enabled = false;
	}

	var ctx = new chalk.constructor(options);

	_.defaults(ctx, chalk);

	ctx.bgError = ctx.bgRed;
	ctx.bgHelp = ctx.bgCyan;
	ctx.bgWarn = ctx.bgYellow;
	ctx.error = ctx.red;
	ctx.help = ctx.cyan;
	ctx.subtle = ctx.grey;
	ctx.warn = ctx.yellow;
	ctx.ignored = ctx.grey.bgWhite;

	return ctx;
};

module.exports = color;