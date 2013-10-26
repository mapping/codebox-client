CodeNow: Getting Started
============

Below you'll find tutorials that will teach you how to use CodeNow, and reference documentation for all the moving parts.

Sign up and create an account on CodeNow at http://codenow.io. There are different ways for creating boxes using CodeNow:

* Using your dashboard at http://codenow.io
* Using the command line tool
* Using the REST API
* Using some librairies for Javascript, Python or Ruby


Each account has an unique **API Token**, we will use this token during the next step for creating and managing Boxes from outside the Dashboard.

## Configure your account

Each boxes who created use the SSH key of your account, you can add the public key to your GitHub, Bitbucket or GitLab account to use private git hosting.

## Using the dashboard

It's very simple to create coding environment using the web dashboard. Simply go to http://codenow.io and log in. Click on *"Create a new box"* and follow the instructions.

You can also manage your differents boxes and access reports about usage and collaborators.

The dashboard is also use to manage credit.

## Using the command line tool

Install Node.js and NPM for your system (Mac, Windows or Linux). And install the command lien tool using:

```
$ npm install codenow -g
```

You can now authorize the client using your **API Token**:

```
$ codenow auth <your api token>
```

Creating boxes is really easy:

```
$ codenow create premium TestBox --git="https://github/FriendCode/codenow.git"
```

## Using the REST API

CodeNow is based on a very simple REST API which allow clients to create boxes from any applications.
You can also use a wrapper for the API in Python, Javascript or Ruby.

All the API methods use the header *Authorization* for authenticate the user.

#### Create a new box

```
$ curl -X POST https://codenow.io/api/boxes \
   -H "Authorization: <your api token>" \
   -d "name=Test" \
   -d "type=premium"
```

Optional paramters are:

* *description*: (string) default is empty
* *git*: (string) default is empty
* *public*: (boolean) default is false

#### List Boxes

```
$ curl -X GET https://codenow.io/api/boxes \
   -H "Authorization: <your api token>"
```

#### Manage collaborators (for private boxes)

Get the list of collaborators emails:

```
$ curl -X GET https://codenow.io/api/box/<box>/collaborators \
   -H "Authorization: <your api token>"
```

Add a collaborator by email:

```
$ curl -X POST https://codenow.io/api/box/<box>/collaborators \
   -H "Authorization: <your api token>" \
   -d "email=youremail@mymail.com"
```

Remove a collaborator by email:

```
$ curl -X DELETE https://codenow.io/api/box/<box>/collaborators \
   -H "Authorization: <your api token>" \
   -d "email=youremail@mymail.com"
```

#### Manage a box

Get the information about a box:

```
$ curl -X GET https://codenow.io/api/box/<box> \
   -H "Authorization: <your api token>"
```

Remove a box:

```
$ curl -X DELETE https://codenow.io/api/box/<box> \
   -H "Authorization: <your api token>"
```

#### Events

List events for a boxes:

```
$ curl -X GET https://codenow.io/api/box/<box>/events \
   -H "Authorization: <your api token>"
```


## Using the node.js library

Create a client:

```
var CodeNow = require("codenow").Client;

var client = new CodeNow({
	'token': "<api token>"
});
```

Create a box:

```
client.create({
	'type': 'premium',
	'name': 'My Node Box'
}).then(function(box) {
	console.log(box.id," : ", box.name)
});
```

List boxes:

```
client.boxes().then(function(boxes) {
	boxes.forEach(function(box) {
		console.log(box.id," : ", box.name)
	})
});
```

Get a box by its id:

```
client.box("7546736a-621d-434f-9c10-ad7cd0773a06").then(function(box) {
	console.log(box.id," : ", box.name)
});
```
