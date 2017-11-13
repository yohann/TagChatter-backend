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

var server = app.listen(5000, function () {
    console.log('Server is running..');
});