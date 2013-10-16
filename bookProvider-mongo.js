BookProviderMongo = function (Book) {
    this.fetchAllBooks = function (cb) {
        Book.findAll(cb);
    };

    this.fetchBookById = function (id, cb) {
        Book.findById(id, cb);
    };

    this.fetchBookByTitle = function (title, cb) {
        Book.findByTitle(title, cb);
    };

    this.insertBook = function (Book, cb) {
        Book.insertBook(Book.title, Book.author, Book.isbn, Book.publisher, 
                            Book.description, Book.datePublished, Book.rating,  Book.subject, cb);
    };
};
exports.BookProviderMongo = BookProviderMongo;

