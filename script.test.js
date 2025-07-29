const library = require("./script");

describe("add book to library", () => {
  test("library length extended", () => {
    const prevLength = library.myLibrary.length;
    library.addBookToLibrary("me", "myself", 111, true);
    expect(library.myLibrary.length > prevLength).toBe(true);
  });
  test("book comes from constructor 'Book'", () => {
    const newBook = library.addBookToLibrary("me", "myself", 111, true);
    expect(newBook instanceof library.Book).toBe(true);
  });
});
