var Formatter = require('./formatter_base');

Formatter.get = function(file, logger, flags) {
	var filePath = file;

	var registered = Formatter._registered;

	var formatter;

	Object.keys(registered).some(
		function(item, index) {
			var registeredItem = registered[item];

			var hasMatch = registeredItem.includes.test(filePath);

			if (hasMatch) {
				formatter = registeredItem;
			}

			return hasMatch;
		}
	);

	if (formatter) {
		var excludes = formatter.excludes;

		formatter = new formatter(file, logger, flags);

		if (excludes && excludes.test(filePath) && (!flags || !flags.force)) {
			formatter.format = Formatter.prototype.format;

			formatter.log(
				'n/a',
				'This file was ignored. Pass the "force" flag if you wish to have it included.',
				'ignored'
			);
		}
	}

	return formatter;
};

module.exports = Formatter;