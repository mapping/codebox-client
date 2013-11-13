#!/usr/bin/env node

// Requires
var Q = require('Q');
var _ = require('underscore');
var fs  =  require('fs');
var path = require('path');
var cli = require('commander');
var pkg = require('../package.json');
var exec = require('child_process').exec;
var Codebox = require('../index.js').Client;

// Settings
var settings = require('cat-settings').loadSync(__dirname + '/../settings.json');
var defaultSettings = {
    'token': '',
    'host': 'https://api.codebox.io'
};
_.defaults(settings, defaultSettings);

// Return package info for addons
var getPackage = function(directory) {
    var git, packagePath, packageInfos;
    packagePath = path.join(directory, "package.json");
    
    // Check directory is a git repository
    return Q.nfcall(exec, "cd "+directory+" && git config --get remote.origin.url").then(function(output) {
        git = output.join("").replace(/(\r\n|\n|\r)/gm, "");
        
        // Check package.json exists
        if (!fs.existsSync(packagePath)) {
            return Q.reject(new Error("package.json not found"));
        } else {
            return Q();
        }
    }).then(function() {
        // Read package.json
        return Q.nfcall(fs.readFile, packagePath, 'utf8');
    }).then(function(output) {
        packageInfos = JSON.parse(output);
        return Q({
            'git': git,
            'package': packageInfos
        })
    });
};

// Client
var client = new Codebox({
    'token': settings.token,
    'host': settings.host
});
client.on("apierror", function(err, body) {
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
        'stack': this.stack,
        'description': this.label
    }).then(function(box) {
        console.log(box.name, "|", box.url);
    });
});

////// Publish an addon
cli
.command('publish [directory]')
.description('Publish an addon.')
.action(function(directory) {
    directory = path.resolve(directory || "./");
    getPackage(directory).then(function(packageInfos) {
        return client.publishAddon(packageInfos);
    }).then(function(addon) {
        console.log("published", addon.name, ":", addon["package"]["version"]);
    }, function(err) {
        console.log("error publishing addon:", err);
    })
});

////// Unpublish an addon
cli
.command('unpublish [directory]')
.description('Unpublish an addon.')
.action(function(directory) {
    directory = path.resolve(directory || "./");
    getPackage(directory).then(function(packageInfos) {
        return client.unpublishAddon(packageInfos["package"].name);
    }).then(function(addon) {
        console.log("Unpublished addon from", directory);
    }, function(err) {
        console.log("error publishing addon:", err);
    })
});


cli.option('-g, --git <git url>', 'GIT url for a new box.');
cli.option('-s, --stack <stack name>', 'Stack for a new box.');
cli.option('-l, --label <Description Label>', 'Description for a new box.');


cli.version(pkg.version).parse(process.argv);

if (!cli.args.length) cli.help();

