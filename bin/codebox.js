#!/usr/bin/env node

// Requries
var _ = require('underscore');
var path = require('path');
var cli = require('commander');
var pkg = require('../package.json');
var Codebox = require('../index.js').Client;

// Settings
var settings = require('cat-settings').loadSync(__dirname + '/../settings.json');
var defaultSettings = {
    'token': '',
    'host': 'https://api.codebox.io'
};
_.defaults(settings, defaultSettings);

// Client
var client = new Codebox({
    'token': settings.token,
    'host': settings.host
});
client.on("error", function(err, body) {
    console.log("error: ", body);
});

////// Define auth token
cli
.command('auth [token]')
.description('configure authentication.')
.action(function(token) {
    if (!token) {
        console.log("Need token to authenticate: codebox-io -h for more infos");
        return;
    }
    console.log("Authentication will use API token:", token);
    settings.token = token;
    settings.saveSync();
});

////// Define hostname
cli
.command('host [hostname]')
.description('configure Codebox host.')
.action(function(host) {
    console.log("Codebox host is:", host);
    settings.host = host;
    settings.saveSync();
});


////// Reset settings
cli
.command('reset')
.description('reset settings.')
.action(function() {
    _.extend(settings, defaultSettings);
    settings.saveSync();
    console.log("Settings have been reset!");
});


////// List boxes
cli
.command('list')
.description('list boxes.')
.action(function() {
    client.boxes().then(function(boxes) {
        boxes.forEach(function(box) {
            console.log(box.name, "|", box.url)
        })
    });
});

////// Create a box
cli
.command('create [type] [name]')
.description('create a new box (type could be premium or free).')
.action(function(boxType, boxName) {
    if (!boxType || !boxName) {
        console.log("Need 'name' and 'type' to create a box");
        return;
    }

    client.create({
        'name': boxName,
        'type': boxType,
        'git': this.git,
        'description': this.label
    }).then(function(box) {
        console.log(box.name, "|", box.url);
    });
});

cli.option('-g, --git <git url>', 'GIT url for a new box.');
cli.option('-l, --label <Description Label>', 'Description for a new box.');


cli.version(pkg.version).parse(process.argv);

if (!cli.args.length) cli.help();

