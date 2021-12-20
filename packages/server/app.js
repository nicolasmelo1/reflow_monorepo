const { sum } = require('../shared')
var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    console.log(sum(1, 2))
    res.send('hello world')
});

var port = 3001

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});