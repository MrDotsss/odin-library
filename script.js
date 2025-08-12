const addBookBtn = document.querySelector(".add-book-container button");
const newBookDialog = document.getElementById("new-book-dialog");
const newBookForm = document.getElementById("new-book-form");
const cancelFormBtn = document.getElementById("cancel-form");

cancelFormBtn.addEventListener("click", (event) => {
  newBookDialog.close();
});

addBookBtn.addEventListener("click", (event) => {
  newBookForm.reset();
  newBookDialog.showModal();
});

newBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  Library.addBook(addBookForm());
  newBookDialog.close();
});

//#region  Class Utilities
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Book {
  constructor(name, author, pages, image, description, read) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.image = image;
    this.description = description;
    this.read = read;
  }

  #readBtn = null;
  #section = null;
  #id = crypto.randomUUID();

  get id() {
    return this.#id;
  }

  set name(newName) {
    this._name = newName.toString();
  }

  get name() {
    return this._name;
  }

  set author(newAuthor) {
    this._author = newAuthor.toString();
  }

  get author() {
    return this._author;
  }

  set pages(newPage) {
    if (Number.isInteger(newPage) && newPage > -1) {
      this._pages = newPage;
    } else {
      console.error(`Pages for ${this._name} must be a positive number.`);
    }
  }

  get pages() {
    return this._pages;
  }

  set image(newImage) {
    this._image = newImage.toString();
  }

  get image() {
    return this._image;
  }

  set description(newDescription) {
    this._description = newDescription.toString();
  }

  get description() {
    return this._description;
  }

  set read(newRead) {
    if (typeof newRead === "boolean") {
      this._read = newRead;
    } else {
      console.error(`Read for ${this._name} must be boolean.`);
    }
  }

  toggleRead() {
    if (this.#section != null) {
      const currentClass = this._read ? "read-line" : "book-line";
      const newClass = this._read ? "book-line" : "read-line";
      const hrs = this.#section.querySelectorAll(`.${currentClass}`);

      hrs.forEach((element) => {
        element.classList.replace(currentClass, newClass);
      });
    }
    this._read = !this._read;
    if (this.#readBtn != null) {
      this.#readBtn.textContent = this._read ? "Mark Unread" : "Mark Read";
    }
  }

  removeUI() {
    if (this.#section != null) {
      this.#section.remove();
    }
  }

  buildUI() {
    this.#section = document.createElement("section");
    this.#section.classList.add("book-item");

    const bookTitle = document.createElement("h1");
    bookTitle.classList.add("book-title");
    bookTitle.textContent = this._name;
    this.#section.appendChild(bookTitle);

    const bookLine1 = document.createElement("hr");
    bookLine1.classList.add(this._read ? "read-line" : "book-line");
    this.#section.appendChild(bookLine1);

    const figure = document.createElement("figure");
    figure.classList.add("book-image");
    if (this._image.length > 0) {
      const img = document.createElement("img");
      img.src = this._image.toString();
      figure.appendChild(img);
    } else {
      const div = document.createElement("div");
      div.textContent = "No Image";
      figure.appendChild(div);
    }
    this.#section.appendChild(figure);

    const bookLine2 = document.createElement("hr");
    bookLine2.classList.add(this._read ? "read-line" : "book-line");
    this.#section.appendChild(bookLine2);

    const h2 = document.createElement("h2");
    h2.classList.add("book-author");
    h2.textContent = this._author;
    this.#section.appendChild(h2);

    const pagesText = document.createElement("p");
    pagesText.classList.add("total-pages");
    pagesText.textContent = this._pages.toLocaleString("en-US") + " pages";
    this.#section.appendChild(pagesText);

    const btnGroup = document.createElement("div");
    btnGroup.classList.add("button-group");
    btnGroup.dataset.bookId = this.#id;
    this.#readBtn = document.createElement("button");
    this.#readBtn.classList.add("toggle-read");
    this.#readBtn.textContent = this._read ? "Mark Unread" : "Mark Read";
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-book");
    removeBtn.textContent = "Remove";
    btnGroup.appendChild(this.#readBtn);
    btnGroup.appendChild(removeBtn);
    this.#section.appendChild(btnGroup);

    const div = document.createElement("div");
    div.classList.add("description-container");
    const p2 = document.createElement("p");
    p2.textContent =
      this._description.length > 0 ? this._description : "No description";
    div.appendChild(p2);
    this.#section.appendChild(div);

    return this.#section;
  }
}

class Library {
  static #books = [];

  static addBook(book) {
    if (book instanceof Book) {
      const bookGrid = document.querySelector(".book-grid");
      this.#books.push(book);
      const ui = book.buildUI();
      bookGrid.prepend(ui);
    } else if (Array.isArray(book)) {
      this.#books.push(...book);
    } else {
      throw Error(
        `${book} should be an instance of Book class, instead of '${typeof book}'`
      );
    }
  }
  static async buildLibrary() {
    const bookGrid = document.querySelector(".book-grid");
    bookGrid.addEventListener("click", (event) => {
      const id = event.target.parentElement.dataset.bookId;
      const index = this.#books.findIndex((book) => book.id === id);
      if (index !== -1) {
        if (event.target.classList.contains("toggle-read")) {
          this.#books[index].toggleRead();
        } else if (event.target.classList.contains("remove-book")) {
          this.#books[index].removeUI();
          this.#books.splice(index, 1);
          console.table(this.#books);
        }
      }
    });

    if (bookGrid) {
      for (let i = 0; i < this.#books.length; i++) {
        const book = this.#books[i].buildUI();
        bookGrid.prepend(book);
        await sleep(300);
      }
    }
  }
}
//#endregion

function addBookForm() {
  const inputValues = new Book(
    document.getElementById("book-title-input").value,
    document.getElementById("book-author-input").value,
    Number(document.getElementById("book-pages-input").value),
    document.getElementById("book-image-input").value,
    document.getElementById("book-description-input").value,
    document.getElementById("mark-read-input").checked
  );

  return inputValues;
}

const books = [
  new Book(
    "One Piece",
    "Eiichiro Oda",
    24000,
    "https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg",
    "One Piece is a Japanese manga series written and illustrated by Eiichiro Oda. It follows the adventures of Monkey D. Luffy and his crew, the Straw Hat Pirates, as he explores the Grand Line in search of the mythical treasure known as the 'One Piece' to become the next King of the Pirates.",
    true
  ),
];
Library.addBook(books);
Library.buildLibrary();
