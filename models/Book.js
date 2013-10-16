module.exports = function (config, mongoose) {
    var BookSchema = new mongoose.Schema({
        Title: { type: String },
        Author: { type: String },
        ISBN: { type: String },
        Publisher: { type: String },
        Description: { type: String },
        DatePublished: { type: Date },
        InternalRating: { type: Number, min: 0, max: 10 },
        Subject: { type: String }
    }, { collection: 'logicalitem' });
    BookSchema.set('collection', 'logicalitem');

    var Book = mongoose.model('logicalitem', BookSchema, 'logicalitem');

    var findAll = function (callback) {
        Book.find({}, function (err, books) {
            console.log(books);
            if (err) {
                callback(err, null);
            } else {
                callback(null, books);
            }
        });
    };

    var findByTitle = function (title, callback) {
        Book.findOne({ Title: {$regex:title}}, function (err, book) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, book);
            }
        });
    };

    var insertBook = function (title, author, isbn, publisher, description, datePublished,
                                    rating, subject, callback) {

        var book = new Book({
            Title: title,
            Author: author,
            ISBN: isbn,
            Publisher: publisher,
            Description: description,
            DatePublished: datePublished,
            InternalRating: rating,
            Subject: subject
        });
        book.save(function (err, doc) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, doc);
            }
        });
    };

    return {
        findAll: findAll,
        findByTitle: findByTitle,
        insertBook: insertBook,
        Book: Book
    }
}