BookManager = function (app, Book) {
    var BookProviderMongo = require('./bookProvider-mongo').BookProviderMongo;
    var bookProviderMongo = new BookProviderMongo(Book);

    app.get('/books', function (req, res) {
        console.log('getting books');
        bookProviderMongo.fetchAllBooks(function (error, books) {
            res.send(books);
        });
    });

    app.post('/books', function (req, res) {
        console.log(req.body);
        BookProviderMongo.insertBook(req.body, function (error, Book) {
            if (error) {
                res.send(error, 500);
            } else {
                res.json(Book);
            }
        });
    });

    app.get('/books/title/:title', function (req, res) {
        bookProviderMongo.fetchBookByTitle(req.params.title, function (error, book) {
            if (error) {
                res.send(error, 500);
            } else {
                res.json(book);
            }

        });
    });


    /*app.put('/books/:title', function(req, res) {
    var _Book = req.body;
    _Book.title = req.params.title;

    BookProviderMongo.updateBook(_Book, function(error, Book) {
    if (Book == null) {
    res.send(error, 404);
    } else {
    res.send(Book);
    }
    });
    });

    app.get('/books/:id', function(req, res) {
    BookProviderMongo.fetchBookById(req.params.id, function(error, Book) {
    if (Book == null) {
    BookProviderMongo.fetchBookByEmail(req.params.id, function(error, Book) {
    if (Book == null) {
    res.send(error, 404);
    }else {
    res.send(Book);
    }
    });
    } else {
    res.send(Book);
    }
    });
    });

    app.delete('/books/:email', function(req, res) {
    BookProviderMongo.deleteBook(req.params.email, function(error, numOfDeleted) {
    if (error) {
    res.send(error, 500);
    }else{
    res.send(numOfDeleted);
    }
    });
    });*/
};

exports.BookManager = BookManager;