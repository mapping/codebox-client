var util = require('util');
var _ = require('underscore');
var Model = require('./model');

var Box = function() {
	Model.apply(this, arguments);

	_.defaults(this, {
		'id': null,
		'name': null,
		'description': null,
		'public': true,
		'type': "premium",
		'owner': null,
		'createdAt': 0,
		'uptime': 0,
		'url': null,
		'collaborators': [ ]
	});
};
util.inherits(Box, Model);

module.exports = Box;