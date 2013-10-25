#!/usr/bin/env node

// Requries
var _ = require('underscore');
var path = require('path');
var cli = require('commander');
var pkg = require('../package.json');
var settings = require('cat-settings').loadSync(__dirname + '/../settings.json');

var defaultSettings = {
    'token': '',
    'host': 'http://codenow.io'
};

_.defaults(settings, defaultSettings);

cli
.command('auth [token]')
.description('configure authentication.')
.action(function(token) {
    console.log("Authentication will use API token:", token);
    settings.token = token;
    settings.saveSync();
});

cli
.command('host [hostname]')
.description('configure CodeNow host.')
.action(function(host) {
    console.log("CodeNow host is:", host);
    settings.host = host;
    settings.saveSync();
});

cli
.command('reset')
.description('reset settings.')
.action(function() {
    _.extend(settings, defaultSettings);
    settings.saveSync();
});

cli
.command('create [type]')
.description('create a new box (type could be premium or free).')
.action(function(boxType) {
    
});

cli.option('-n, --name <box name>', 'Name for the box.');
cli.option('-g, --git <git url>', 'GIT url for the box.');


cli.version(pkg.version).parse(process.argv);

if (!cli.args.length) cli.help();

