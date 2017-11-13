var express = require('express');
var app = express();

app.get('/users', function (req, res) {
    //reading users.json
    var users = require('./users.json');     

    //users to be returned
    var retUsers = [];
    
    for (var i = 0, len = users.length; i < len; i++) {
        //tranforming into the Users model
        retUsers.push({id: users[i].id,
                     name: users[i].first_name +" "+ users[i].last_name,
                   avatar: users[i].avatar});
    }

    //function to sort by name
    function compare(a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
        }

    //returning users sorted by name
    res.send(retUsers.sort(compare));
});

app.get('/channels', function (req, res) {
    //reading channels.json
    var channels = require('./channels.json');     
    
    //function to sort by name
    function compare(a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
        }

    //deleting channels.public field
    for (var i = 0, len = channels.length; i < len; i++) {
        delete channels[i].public;
    }

    //returning channels sorted by name
    res.send(channels.sort(compare));
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});