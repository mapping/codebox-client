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
				deferred.reject(body);
			}
		});

		return deferred.promise;
	};

	// Resources getter
	this.getter = function(method, Model, options) {
		options = _.defaults({}, options || {}, {
			'select': null
		});

		return _.bind(function(args) {
			return this.request("get", "boxes", args).then(function(data) {
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
	this.boxes = this.getter("boxes", Box, {select: 'boxes'});

};
util.inherits(Client, events.EventEmitter);

module.exports = Client;