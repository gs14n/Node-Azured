module.exports = function (config, mongoose, nodemailer) {
    var crypto = require('crypto');

    var AccountSchema = new mongoose.Schema({
        email: { type: String, unique: true },
        password: { type: String },
        name: {
            first: { type: String },
            last: { type: String }
        },
        birthday: {
            day: { type: Number, min: 1, max: 31, required: false },
            month: { type: Number, min: 1, max: 12, required: false },
            year: { type: Number }
        },
        photoUrl: { type: String },
        biography: { type: String }
    });

    var Account = mongoose.model('Account', AccountSchema);

    var registerCallback = function (err) {
        if (err) {
            return console.log(err);
        };
        return console.log('Account was created');
    };

    var changePassword = function (accountId, newpassword) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(newpassword);
        var hashedPassword = shaSum.digest('hex');
        Account.update({ _id: accountId }, { $set: { password: hashedPassword} }, { upsert: false },
      function changePasswordCallback(err) {
          console.log('Change password done for account ' + accountId);
      });
    };

    var forgotPassword = function (email, resetPasswordUrl, callback) {
        var user = Account.findOne({ email: email }, function findAccount(err, doc) {
            if (err) {
                // Email address is not a valid user
                callback(false);
            } else {
                var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
                resetPasswordUrl += '?account=' + doc._id;
                smtpTransport.sendMail({
                    from: 'admin@unum-elib.azurewebsites.com',
                    to: doc.email,
                    subject: 'Unum-elib Network Password Request',
                    text: 'Click here to reset your password: ' + resetPasswordUrl
                }, function forgotPasswordResult(err) {
                    if (err) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            }
        });
    };

    var login = function (email, password, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        Account.findOne({ email: email, password: shaSum.digest('hex') }, function (err, doc) {
            callback(doc);
        });
    };

    var findAll = function (callback) {
        Account.find({}, function (err, accounts) {
            callback(null, accounts);
        });
    };

    var findById = function (id, callback) {
        Account.findOne({ _id: id }, function (err, account) {
            callback(null, account);
        });
    };

    var findByEmail = function (email, callback) {
        Account.findOne({ email: email }, function (err, account) {
            callback(null, account);
        });
    };

    var insertUser = function (email, password, firstName, lastName, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);

        var user = new Account({
            email: email,
            name: {
                first: firstName,
                last: lastName
            },
            password: shaSum.digest('hex')
        });
        user.save(function (err, doc) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, doc);
            }
        });
    };

    var updateUserByEmail = function (email, newpassword, newFirstName, newLastName, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(newpassword);
        var hashedPassword = shaSum.digest('hex');
        Account.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword, "name.first": newFirstName, "name.last": newLastName} }, { upsert: false },
          function (err, doc) {
              if (err) {
                  callback(err, null);
              } else {
                  callback(null, doc);
              }
          });
    };

    var deleteUserByEmail = function (email, callback) {
        console.log("deleting user by email " + email);
        Account.findOneAndRemove({ email: email }, function (err, numOfDeleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, numOfDeleted);
            }
        });
    };

    var register = function (email, password, firstName, lastName) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);

        console.log('Registering ' + email);
        var user = new Account({
            email: email,
            name: {
                first: firstName,
                last: lastName
            },
            password: shaSum.digest('hex')
        });
        user.save(registerCallback);
        console.log('Save command was sent');
    }

    return {
        register: register,
        forgotPassword: forgotPassword,
        changePassword: changePassword,
        login: login,
        findAll: findAll,
        findById: findById,
        findByEmail: findByEmail,
        insertUser: insertUser,
        updateUserByEmail: updateUserByEmail,
        deleteUserByEmail: deleteUserByEmail,
        Account: Account
    }
}
