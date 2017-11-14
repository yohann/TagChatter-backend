var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/users', function (req, res) {
    //reading users.json
    var users = require('./users.json');     

    //transforming users into Users model
    var retUsers = modelUser(users);

    //function to sort by name
    function compare(a,b) {
        if(a.name==b.name)
           return 0;
        return a.name>b.name?1:-1
    }

    //returning users sorted by name
    res.send(retUsers.sort(compare));
});

//function to make users into Users model
function modelUser(users)
{
    var ret = [];
    for (let i = 0, len = users.length; i < len; i++) {
        //tranforming into the Users model
        ret.push({id: users[i].id,
                     name: users[i].first_name +" "+ users[i].last_name,
                   avatar: users[i].avatar});
    }

    return ret;
}

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
    var channelId = req.params.channelId; //getting channelId
    var message = req.body.message; //getting message
    var author = req.body.author_id; //getting author id

    //cheking if parameter message exists
    if(!message)
    {
        res.status(400).send({
            type: 'bad_request',
            message: 'Parameter "message" is invalid'
        });
        return;
    }

    //cheking if parameter author exists
    if(!author)
    {
        res.status(400).send({
            type: 'bad_request',
            message: 'Parameter "author_id" is invalid'
        });
        return;
    }

    //getting channels for search
    var channel = require('./channels.json').filter(function( obj ) {
        return obj.id == channelId;
    });

    //checking if channel exists
    if(channel.length<=0)
    {
        res.status(404).send({
            type: 'not_found',
            message: '"Channel" not found'
        });
        return;
    }

    //getting users list already in Users model
    var users = modelUser(require('./users.json'));

    //searching author in users list
    var sender = users.filter(function( obj ) {
        return obj.id == author;
    });

    //checking if User was found
    if(sender.length<=0)
    {
        res.status(404).send({
            type: 'not_found',
            message: '"User" not found'
        });
        return;
    }

    //returning response as Message model
    res.send({id:"idunico",// a fazer
              content:message,
              created_at: new Date().toISOString(),
              author:sender});
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});