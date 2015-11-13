'use strict';

var REGEX_SUB = /\{\s*([^}]+?)\s*\}/g;

module.exports = function(str, obj) {
	var objType = typeof obj;

	if (objType !== 'object' && objType !== 'function') {
		obj = Array.prototype.slice.call(arguments, 1);
	}

	if (str.replace) {
		str = str.replace(
			REGEX_SUB,
			function(match, key) {
				return (typeof obj[key] !== 'undefined') ? obj[key] : match;
			}
		);
	}

	return str;
};