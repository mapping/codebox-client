var request = require('request');
var _ = require('underscore');
var events = require('events');
var util = require('util');
var Q = require('Q');

var Box = require('./box');

var Client = function(config) {
	events.EventEmitter.call(this);

	this.config = _.defaults({}, config || {}, {
		'host': 'https://codenow.io',
		'token': null
	});

	// Do a rest api request
	// mode: get, post, delete, ...
	// method: api method name
	// args: api args
	this.request = function(mode, method, args) {
		var that = this;
		var deferred = Q.defer();

		request(this.config.host+"/api/"+method, {
			'method': mode,
			'json': true,
			'form': args,
			'headers': {
				'Authorization': this.config.token
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				deferred.resolve(body);
			} else {
				that.emit("error", error, body);
				deferred.reject(body);
			}
		});

		return deferred.promise;
	};

	// Resources access
	this.ressource = function(Method, Model, options) {
		options = _.defaults({}, options || {}, {
			'mode': 'get',
			'select': null,
			'argsContext': null
		});

		return _.bind(function() {
			var method = Method;

			var args = Array.prototype.slice.call(arguments, 0);
			var methodArgs = (method.split("?").length - 1); // n args for this method

			// Bind args in url
			var bindArgs = args.slice(0, methodArgs);
			_.each(bindArgs, function(arg) {
				method = method.replace("?", args);
			});

			formArgs = args.slice(methodArgs, 1)[0] || {};

			// Use args context: {a:} -> {b: {a:} }
			if (options.argsContext) {
				var oldArgs = formArgs;
				formArgs = {};
				formArgs[options.argsContext] = oldArgs;
			}

			return this.request(options.mode, method, formArgs).then(function(data) {
				// Use selector {a: {b:} } -> {b:}
				if (options.select) {
					data = data[options.select];
				}

				if (!data) {
					return null;
				}

				if (!_.isArray(data)) {
					return new Model(this, data);
				}
				return _.map(data, function(d) {
					return new Model(this, d);
				}, this);
			});
		}, this);
	}

	// Get list of boxes
	this.boxes = this.ressource("boxes", Box, {select: 'boxes'});

	// Get a box
	this.box = this.ressource("box/?", Box);

	// Create a box
	this.create = this.ressource("boxes", Box, {mode: 'post', argsContext: 'box'});
};
util.inherits(Client, events.EventEmitter);

module.exports = Client;