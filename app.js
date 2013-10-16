var express = require("express");
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Import the accounts
var Account = require('./models/Account')(config, mongoose, nodemailer);
var Book = require('./models/Book')(config, mongoose);

//<------------ UI related URIs
app.configure(function () {
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.use(express.limit('1mb'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: " secret key", store: new MemoryStore() }));
    var options = {
        db: { native_parser: true },
        server: { poolSize: 5 }
    }
    options.server.socketOptions = { keepAlive: 1 };
    mongoose.connect('mongodb://ucld-elib01.cloudapp.net/nodejsdb', options);
    //mongoose.connect('mongodb://localhost/eLibrary', options);
});

app.get('/', function (req, res) {
    res.render('index.jade');
});

app.post('/login', function (req, res) {
    var email = req.param('email', null);
    var password = req.param('password', null);

    if (null == email || email.length < 1
      || null == password || password.length < 1) {
        res.send(400);
        return;
    }

    Account.login(email, password, function (doc) {
        if (doc == null) {
            res.send(401);
            return;
        }
        req.session.loggedIn = true;
        console.log("Login successful");
        res.send(200);

    });
});

app.post('/register', function(req, res) {
  var firstName = req.param('firstName', '');
  var lastName = req.param('lastName', '');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || email.length < 1
       || null == password || password.length < 1 ) {
    res.send(400);
    return;
  }

  Account.register(email, password, firstName, lastName);
  res.send(200);
});

app.get('/account/authenticated', function (req, res) {
    if (req.session.loggedIn) {
        res.send(200);
    } else {
        res.send(401);
    }
});

app.post('/forgotpassword', function(req, res) {
  var hostname = req.headers.host;
  var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  var email = req.param('email', null);
  if ( null == email || email.length < 1 ) {
    res.send(400);
    return;
  }

  Account.forgotPassword(email, resetPasswordUrl, function(success){
    if (success) {
      res.send(200);
    } else {
      // Username or password not found
      res.send(404);
    }
  });
});

app.get('/resetPassword', function(req, res) {
  var accountId = req.param('account', null);
  res.render('resetPassword.jade', {locals:{accountId:accountId}});
});

app.post('/resetPassword', function(req, res) {
  var accountId = req.param('accountId', null);
  var password = req.param('password', null);
  if ( null != accountId && null != password ) {
    Account.changePassword(accountId, password);
  }
  res.render('resetPasswordSuccess.jade');
});

app.post('/searchbook', function (req, res) {
    var title = req.param('title', null);
    if (null != title) {
        Book.findByTitle(title, function (err, doc) {
            if (err) {
                res.send(500);
                return;
                //res.render('bookSearchFailed.jade');
            } else {
                if (doc != null) {
                    res.json(doc);
                    return;
                    //res.render('bookSearchSuccess.jade');
                } else {
                    res.send(404);
                    return;
                }
            }
        });
    }
});

app.post('/upload', function (req, res) {
    var message = req.param('message', null);
    if (null != message) {
        var mongo = require('mongodb');
        var MongoClient = mongo.MongoClient;
        var Grid = mongo.Grid;
        // Connect to the db
        MongoClient.connect("mongodb://ucld-elib01.cloudapp.net/nodejsdb", function (err, db) {
            if (err) return console.dir(err);
            var grid = new Grid(db, 'fs');
            var buffer = new Buffer("message");
            grid.put(buffer, { metadata: { category: 'text' }, content_type: 'text' }, function (err, fileInfo) {
                if (!err) {
                    console.log("Finished writing file to Mongo");
                    res.send(200);
                }
            });
        });
    }
});

/*        var buffer = new Buffer(message);
        grid.put(buffer, { metadata: { category: 'text' }, content_type: 'text' },
         function (err, fileInfo) {
            if (!err) {
                console.log("Finished writing file to Mongo " + fileInfo);
                res.send(200);
            } else {
                console.log("Unable to write message to GridFS");
                res.send(500);
            }
        });
    }*/

//---------------- UI related URIs-->

var UserManager = require('./userManager').UserManager;
var userManagerService = new UserManager(app, Account);
var bookManager = require('./bookManager').BookManager;
var bookManagerService = new BookManager(app, Book);


app.listen(process.env.PORT || 8080);
console.log("server started");