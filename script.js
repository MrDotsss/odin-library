const myLibrary = [];

function Book(author, title, page, read) {
  if (!new.target) {
    return Error("You must use 'new' keyword to create new Book object.");
  }

  this.id = crypto.randomUUID();
  this.author = author;
  this.title = title;
  this.page = page;
  this.read = read;
  this.info = () => [
    this.author,
    this.title,
    this.page,
    this.read ? "✅" : "❌",
  ];
}

Book.prototype.toggleRead = () => {
  this.read = !this.read;
};

function addBookToLibrary(author, title, page, read) {
  const newBook = new Book(author, title, page, read);
  myLibrary.push(newBook);
  return newBook;
}

if (typeof module !== "undefined") {
  module.exports = {
    Book,
    myLibrary,
    addBookToLibrary,
  };
}
