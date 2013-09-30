UserManager = function(app, Account) {
  var UserProviderMongo = require('./userProvider-mongo').UserProviderMongo;
  var userProviderMongo = new UserProviderMongo(Account);

  app.get('/users', function(req, res) {
    userProviderMongo.fetchAllUsers(function(error, users) {
      res.send(users);
    });
  });

  app.post('/users', function(req, res) {
    console.log(req.body);
    userProviderMongo.insertUser(req.body, function(error, user) {
      if (error) {
        res.send(error, 500);
      } else {
        res.json(user);
      }
    });
  });

   app.put('/users/:email', function(req, res) {
        var _user = req.body;
        _user.email = req.params.email;

        userProviderMongo.updateUser(_user, function(error, user) {
          if (user == null) {
            res.send(error, 404);
          } else {
            res.send(user);
          }
        });
  });

  app.get('/users/:id', function(req, res) {
    userProviderMongo.fetchUserById(req.params.id, function(error, user) {
      if (user == null) {
        userProviderMongo.fetchUserByEmail(req.params.id, function(error, user) {
        if (user == null) {
          res.send(error, 404);
        }else {
          res.send(user);
        }
      });
      } else {
        res.send(user);
      }
    });
  });

  app.delete('/users/:email', function(req, res) {
    userProviderMongo.deleteUser(req.params.email, function(error, numOfDeleted) {
        if (error) {
          res.send(error, 500);
        }else{
          res.send(numOfDeleted);
        }
    });
  });
};

exports.UserManager = UserManager;