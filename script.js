const myLibrary = [];

const addNewDialog = document.querySelector("#add-book-modal");
const cancelDialog = document.querySelector(".cancel-btn");
const form = document.querySelector(".add-book-dialog form");

const authorInput = document.querySelector("#author-name");
const titleInput = document.querySelector("#book-title");
const pageInput = document.querySelector("#total-pages");
const imageInput = document.querySelector("#image-url");
const readCheckbox = document.querySelector("#is-read");

const bookshelfGrid = document.querySelector(".bookshelf-grid");

cancelDialog.addEventListener("click", (event) => {
  addNewDialog.close();
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.table(
    addBookToLibrary(
      authorInput.value,
      titleInput.value,
      imageInput.value,
      parseInt(pageInput.value),
      readCheckbox.checked
    )
  );
  addNewDialog.close();
});

function Book(author, title, imageUrl, page, read) {
  if (!new.target) {
    return Error("You must use 'new' keyword to create new Book object.");
  }

  this.id = crypto.randomUUID();
  this.author = author;
  this.title = title;
  this.imageUrl = imageUrl;
  this.page = page;
  this.read = read;
  this.info = () => [
    this.author,
    this.title,
    this.imageUrl,
    this.page,
    this.read ? "✅" : "❌",
  ];
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};
addBookToLibrary(
  "Eiichiro Oda",
  "One Piece",
  "https://images-us.bookshop.org/ingram/9781974752225.jpg?v=enc-v1",
  21450,
  true
);

addBookToLibrary(
  "Yukinobu Tatsu",
  "Dandadan",
  "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Dandadan_vol._1_cover.jpg/250px-Dandadan_vol._1_cover.jpg",
  2000,
  true
);

addBookToLibrary(
  "Koyoharu Gotouge",
  "Demon Slayer: Kimetsu no Yaiba",
  "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg/250px-Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg",
  4496,
  true
);

updateUI();

function addBookToLibrary(author, title, imageUrl, page, read) {
  const newBook = new Book(author, title, imageUrl, page, read);
  myLibrary.push(newBook);
  bookshelfGrid.prepend(buildBook(newBook));
  return newBook;
}

function removeBookToLibrary(book) {
  const index = myLibrary.indexOf(book);
  if (index > -1) {
    myLibrary.splice(index, 1);
  }

  updateUI();
}

async function updateUI() {
  bookshelfGrid.innerHTML = "";

  const addNew = document.createElement("section");
  addNew.classList.add("book", "add-new");
  addNew.addEventListener("click", (event) => {
    form.reset();
    addNewDialog.showModal();
  });

  const h1 = document.createElement("h1");
  h1.textContent = "➕";
  const h1New = document.createElement("h1");
  h1New.textContent = "Add New";
  addNew.appendChild(h1);
  addNew.appendChild(h1New);

  bookshelfGrid.appendChild(addNew);

  for (let i = 0; i < myLibrary.length; i++) {
    const element = buildBook(myLibrary[i]);
    bookshelfGrid.prepend(element);
    await sleep(250);
  }
}

function buildBook(book) {
  const section = document.createElement("section");
  section.classList.add("book");
  section.dataset.bookId = book.id;

  if (book.read) {
    const read = document.createElement("div");
    read.classList.add("read");
    read.textContent = "📚";
    section.appendChild(read);
  }

  const h1 = document.createElement("h1");
  h1.classList.add("book-title");
  h1.textContent = book.title;
  section.appendChild(h1);

  const bookBar = document.createElement("div");
  bookBar.classList.add("book-bar");
  section.appendChild(bookBar);

  const figure = document.createElement("figure");
  figure.classList.add("book-cover");
  if (book.imageUrl.trim().length !== 0) {
    const img = document.createElement("img");
    img.classList.add("book-img");
    img.src = book.imageUrl;

    figure.appendChild(img);
  } else {
    const div = document.createElement("div");
    div.classList.add("book-img");
    div.textContent = "No Image";
    figure.appendChild(div);
  }
  section.appendChild(figure);

  const bookBar2 = document.createElement("div");
  bookBar2.classList.add("book-bar");
  section.appendChild(bookBar2);

  const authorPage = document.createElement("div");
  authorPage.classList.add("author-page");
  const h3 = document.createElement("h3");
  h3.classList.add("book-author");
  h3.textContent = book.author;
  const p = document.createElement("p");
  p.classList.add("total-pages");
  p.textContent = book.page.toString() + " Pages";
  authorPage.appendChild(h3);
  authorPage.appendChild(p);
  section.appendChild(authorPage);

  const btnGroup = document.createElement("div");
  btnGroup.classList.add("book-btn-group");
  const readBtn = document.createElement("button");
  readBtn.classList.add("book-read-btn");
  readBtn.textContent = book.read ? "Mark Unread" : "Mark Read";
  btnGroup.appendChild(readBtn);
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("book-remove-btn");
  removeBtn.textContent = "Remove";
  btnGroup.appendChild(removeBtn);
  section.appendChild(btnGroup);

  return section;
}

if (typeof module !== "undefined") {
  module.exports = {
    Book,
    myLibrary,
    addBookToLibrary,
    removeBookToLibrary,
  };
}
