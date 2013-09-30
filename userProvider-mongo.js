UserProviderMongo = function (Account) {
    this.fetchAllUsers = function (cb) {
        Account.findAll(cb);
    };

    this.fetchUserById = function (id, cb) {
        Account.findById(id, cb);
    };

    this.fetchUserByEmail = function (email, cb) {
        Account.findByEmail(email, cb);
    };

    this.insertUser = function (user, cb) {
        Account.insertUser(user.email, user.password, user.firstName, user.lastName, cb);
    };

    this.updateUser = function (user, cb) {
        Account.updateUserByEmail(user.email, user.password, user.firstName, user.lastName, cb);
    };

    this.deleteUser = function (email, cb) {
        Account.deleteUserByEmail(email, cb);
    };
};
exports.UserProviderMongo = UserProviderMongo;

