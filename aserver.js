var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('view options', {layout:true});
app.set('views', __dirname + '/views');

var userCount = 0;
app.get('/blog', function (req, res) {
    userCount++;
    res.send('Coming Soon');
});

app.get('/?', function (req, res) {
    userCount++;
    //res.write('Coming Soon. \n');
    //res.end('This page has been visited '+ userCount +' times');
    res.render('home', {message:'Hello World', visits:userCount});

});

app.listen(process.env.PORT || 8080);
console.log('Listening on port');





/*var userCount = 0;
http.createServer(function (req, res) {
    userCount++;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    console.dir(MongoClient);
    res.write(userCount + ' visits. \n');
    res.end('Hello, where in the world are you?');


}).listen(process.env.PORT || 8080);*/