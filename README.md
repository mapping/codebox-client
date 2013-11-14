Codebox: Getting Started
============

Below you'll find tutorials that will teach you how to use Codebox, and reference documentation for all the moving parts.

Sign up and create an account on Codebox at https://www.codebox.io. There are different ways for creating boxes using Codebox:

* Using your dashboard at https://www.codebox.io
* Using the command line tool
* Using the REST API
* Using some librairies for Javascript, Python or Ruby


Each account has an unique **API Token**, we will use this token during the next step for creating and managing Boxes from outside the Dashboard.

## Configure your account

Each boxes who created use the SSH key of your account, you can add the public key to your GitHub, Bitbucket or GitLab account to use private git hosting.

## Using the dashboard

It's very simple to create coding environment using the web dashboard. Simply go to https://www.codebox.io and log in. Click on *"Create a new box"* and follow the instructions.

You can also manage your differents boxes and access reports about usage and collaborators.

The dashboard is also use to manage credit.

## Using the command line tool

Install Node.js and NPM for your system (Mac, Windows or Linux). And install the command lien tool using:

```
$ npm install codebox-io -g
```

You can now authorize the client using your **API Token**:

```
$ codebox-io auth <your api token>
```

Creating boxes is really easy:

```
$ codebox-io create type1 TestBox --stack="node" --git="https://github/FriendCode/codebox-client.git"
```

You can learn more about differents stacks in [the documentation](docs/stacks.md) and more about [the pricing](https://www.codebox.io).

## Using the REST API

Codebox is based on a very simple REST API which allow clients to create boxes from any applications.
You can also use a wrapper for the API in Python, Javascript or Ruby.

All the API methods use the header *Authorization* for authenticate the user.

#### Create a new box

```
$ curl -X POST https://api.codebox.io/api/boxes \
   -H "Authorization: <your api token>" \
   -d "name=Test" \
   -d "type=type1" \
   -d "stack=node"
```

Optional paramters are:

* *description*: (string) default is empty
* *git*: (string) default is empty
* *public*: (boolean) default is false

#### List Boxes

```
$ curl -X GET https://api.codebox.io/api/boxes \
   -H "Authorization: <your api token>"
```

#### Manage collaborators (for private boxes)

Get the list of collaborators emails:

```
$ curl -X GET https://api.codebox.io/api/box/<box>/collaborators \
   -H "Authorization: <your api token>"
```

Add a collaborator by email:

```
$ curl -X POST https://api.codebox.io/api/box/<box>/collaborators \
   -H "Authorization: <your api token>" \
   -d "email=youremail@mymail.com"
```

Remove a collaborator by email:

```
$ curl -X DELETE https://api.codebox.io/api/box/<box>/collaborators \
   -H "Authorization: <your api token>" \
   -d "email=youremail@mymail.com"
```

#### Manage a box

Get the information about a box:

```
$ curl -X GET https://api.codebox.io/api/box/<box> \
   -H "Authorization: <your api token>"
```

Remove a box:

```
$ curl -X DELETE https://api.codebox.io/api/box/<box> \
   -H "Authorization: <your api token>"
```

#### Events

List events for a boxes:

```
$ curl -X GET https://api.codebox.io/api/box/<box>/events \
   -H "Authorization: <your api token>"
```

#### Activity data

Get box activity:

```
$ curl -X GET https://api.codebox.io/api/box/<box>/activity \
   -H "Authorization: <your api token>"
```


## Using the node.js library

Create a client:

```
var Codebox = require("codebox-io").Client;

var client = new Codebox({
	'token': "<api token>"
});
```

Create a box:

```
client.create({
	'type': 'type1',
	'name': 'My Node Box',
   'stack': 'python'
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

## Managing addons

You can publish addons to the addons registry using the command line tool:

```
$ codenow-io publish ./path/to/the/repository
```

And also unpublish the addon:

```
$ codenow-io unpublish ./path/to/the/repository
```
