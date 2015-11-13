var _ = require('lodash');
var sub = require('string-sub');

var EventEmitter = require('drip').EnhancedEmitter;

var Formatter = function(file, logger, flags) {
	EventEmitter.call(this);

	file = file || '<input>';

	this.file = file;
	this.logger = logger || Formatter.LOGGER;

	this.flags = flags || {};

	if (_.isFunction(this.init)) {
		this.init.apply(this, arguments);
	}

	Formatter.emit('init', this);
};

_.assign(Formatter, EventEmitter.prototype);

EventEmitter.call(Formatter);

Formatter.LOGGER = console;

Formatter.prototype = _.create(
	EventEmitter.prototype,
	{
		format: function(contents) {
			return contents;
		},

		log: function(line, msg, type, props) {
			this.logger.log(line, msg, this.file, type, props);
		}
	}
);

Formatter._registered = {};

Formatter.create = function(obj) {
	if (!_.isObject(obj)) {
		throw Error('You must pass an object to Formatter.create');
	}

	var constructor = Formatter._getConstructor(obj);

	var proto = Object.create(Formatter.prototype);

	var customProto = obj.prototype;

	delete obj.prototype;

	_.assign(proto, customProto);

	proto.constructor = constructor;

	constructor.prototype = proto;

	Formatter._verifyId(obj);
	Formatter._verifyExtensions(obj);

	_.assign(constructor, obj);

	Formatter._registered[obj.id] = constructor;

	return constructor;
};

Formatter._getConstructor = function(obj) {
	var constructor;

	if (obj.hasOwnProperty('constructor')) {
		constructor = obj.constructor;

		delete obj.constructor;
	}
	else {
		constructor = function() {
			return Formatter.apply(this, arguments);
		};
	}

	return constructor;
};

Formatter._verifyId = function(obj) {
	var id = obj.id;

	if (!id || Formatter._registered.hasOwnProperty(id)) {
		var errMsg = sub('The id: "{0}" is already taken', id);

		if (!id) {
			errMsg = 'You must give this formatter an id with the id property';
		}

		throw Error(errMsg);
	}
};

Formatter._verifyExtensions = function(obj) {
	var includes = obj.includes;

	if (!_.isRegExp(includes)) {
		throw Error('The includes property must be a RegExp Object');
	}
};

module.exports = Formatter;