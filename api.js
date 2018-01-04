var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//getting users.json
var usersJson = require('./users.json');

//getting channels.json
var channels = require('./channels.json');
var messages = [];

app.get('/users', function (req, res) {

    //transforming users into Users model
    var retUsers = modelUser(usersJson);

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
    channels = channels;     
    
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
    var channel = channels.filter(function( obj ) {
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
    var users = modelUser(usersJson);

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

    var messageModel = {id:channel[0].id+("000" + messages.length).slice (-4),
                        channel:channel[0].id,
                        content:message,
                        created_at: new Date().toISOString(),
                        author:sender};

    //copying messageModel in return pattern
    retMessage = {id: messageModel.id,
                  content: messageModel.content,
                  created_at:messageModel.created_at,
                  author: messageModel.author};
    messages.push(messageModel);

    //returning response as Message model
    res.send(retMessage);
});

app.get('/channels/:channelId/messages', function(req, res) {
    var channelId = req.params.channelId; //getting channelId

    //getting channels for search
    var channel = channels.filter(function( obj ) {
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

    messagesModel = [];
    for (let i = 0, len = messages.length; i < len; i++) {
        messagesModel.push({id: messages[i].id,
                            content: messages[i].content,
                            created_at:messages[i].created_at,
                            author: messages[i].author});
    }

    res.send(messagesModel);
});

var server = app.listen(5000, function () {
    console.log('Server is running on port 5000...');
});