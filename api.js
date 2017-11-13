var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/users', function (req, res) {
    //reading users.json
    var users = require('./users.json');     

    //users to be returned
    var retUsers = [];
    
    for (let i = 0, len = users.length; i < len; i++) {
        //tranforming into the Users model
        retUsers.push({id: users[i].id,
                     name: users[i].first_name +" "+ users[i].last_name,
                   avatar: users[i].avatar});
    }

    //function to sort by name
    function compare(a,b) {
        if(a.name==b.name)
           return 0;
        return a.name>b.name?1:-1
    }

    //returning users sorted by name
    res.send(retUsers.sort(compare));
});

app.get('/channels', function (req, res) {
    //reading channels.json
    var channels = require('./channels.json');     
    
    //function to sort by name
    function compare(a,b) {
        if(a.name==b.name)
          return 0;
        return a.name>b.name?1:-1
    }

    //deleting channels.public field
    for (let i = 0, len = channels.length; i < len; i++) {
        delete channels[i].public;
    }

    //returning channels sorted by name
    res.send(channels.sort(compare));
});

app.post('/channels/:channelId/messages', function(req, res) {
    var channelId = req.params.channelId;
    var message = req.body.message;

    var users = require('./users.json');
    var sender = users.filter(function( obj ) {
        return obj.id == req.body.author_id;
    });

    res.send({id:"idunico", content:message+"message", created_at:"22/10/2000", author:sender});
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});