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

describe("remove book to library", () => {
  test("library length reduced", () => {
    const bookToRemove = library.addBookToLibrary("me", "myself", 111, true);
    const prevLength = library.myLibrary.length;
    library.removeBookToLibrary(bookToRemove);
    expect(library.myLibrary.length < prevLength).toBe(true);
  });
  test("properly removed the specific book to the library", () => {
    const prevLength = library.myLibrary.length;
    const bookToRemove = library.addBookToLibrary("me", "myself", 111, true);
    library.removeBookToLibrary(bookToRemove);
    expect(library.myLibrary.includes(bookToRemove)).toBe(false);
  });
});
