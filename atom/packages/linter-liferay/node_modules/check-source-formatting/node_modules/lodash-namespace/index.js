'use strict';
module.exports = function(_) {
	if (_ === undefined) {
		_ = require('lodash').runInContext();
	}

	_.mixin(
		{
			namespace: function(obj, path) {
				if (_.isUndefined(path)) {
					path = obj;
					obj = this;
				}

				var value = _.get(obj, path, {});

				obj = _.set(obj, path, value);

				return value;
			}
		},
		{
			chain: false
		}
	);

	return _;
};