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
  new Book(
    "Demon Slayer: Kimetsu no Yaiba",
    "Koyoharu Gotouge",
    4496,
    "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg/250px-Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg",
    "Demon Slayer: Kimetsu no Yaiba is a Japanese manga series written and illustrated by Koyoharu Gotouge. It was serialized in Shueisha's shōnen manga magazine Weekly Shōnen Jump from February 2016 to May 2020, with its chapters collected in 23 tankōbon volumes.",
    false
  ),
  new Book(
    "The Fragrant Flower Blooms with Dignity",
    "Saka Mikami",
    3456,
    "https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Kaoru_Hana_wa_Rin_to_Saku_volume_1_cover.jpg/250px-Kaoru_Hana_wa_Rin_to_Saku_volume_1_cover.jpg",
    "The Fragrant Flower Blooms with Dignity is a Japanese manga series written and illustrated by Saka Mikami. It began serialization on Kodansha's Magazine Pocket manga website and app in October 2021, with its chapters collected in 18 tankōbon volumes as of August 2025.",
    false
  ),
  new Book(
    "Empty Book",
    "Cool isn't it",
    0,
    "",
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium quia excepturi, aliquam dignissimos facilis ut repudiandae! Perferendis doloribus animi magnam labore nihil quasi esse vitae quisquam natus, explicabo, amet reprehenderit? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi eveniet ducimus nisi quae nobis obcaecati nesciunt hic, officia voluptate voluptatem voluptas impedit fugiat dolores fuga tenetur dolor? Vel, voluptatibus laudantium? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam nisi inventore neque. Reprehenderit recusandae velit iste cumque iure sint magni temporibus quasi odit cum unde nulla corrupti, praesentium voluptate cupiditate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo alias minus illo rem sed omnis delectus modi, asperiores, animi, et magni expedita rerum explicabo nulla tempora eaque incidunt exercitationem praesentium!e Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae quasi eaque cum sapiente autem vitae? Dolores, similique provident veniam earum, non ab delectus dolorem quidem natus autem ipsam numquam perspiciatis? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam, sunt. Tempora, porro quam nisi natus repudiandae, voluptatum ab consequatur reiciendis ducimus rem quaerat autem dolore, tempore vero beatae? Hic, accusantium? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eos voluptatibus veritatis, vitae beatae similique odio quos sequi ipsa? Provident maxime perspiciatis omnis quia alias saepe placeat, eum dolore nobis.",
    true
  ),
];
Library.addBook(books);
Library.buildLibrary();
