CodeNow
=======

Command line tool for CodeNow (and Node.js library)

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
$ codenow create premium --name="My Box" --git="https://github/FriendCode/codenow-docs.git"
```

## Using the node.js library

Create a client:

```
var CodeNow = require("codenow");

var client = new CodeNow({
	'token': "<api token>"
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
