const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Author = require("../models/Author");

// upload a image file
const multer = require("multer");
const path = require("path"); // setting path
const fs = require("fs"); // handling filesystems
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  }
});

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title !== null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
  }

  try {
    const books = await Book.find(searchOptions);
    res.render("books/index", {
      booksList: books,
      searchOptions: req.query
    });
  } catch {
    res.redirect("/");
  }
});

// New Book Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

router.get("/:bookID", async (req, res) => {
  const book = await Book.findOne({
    _id: req.params.bookID
  });
  try {
    res.render("books/info", {
      book: book
    });
  } catch {
    res.render("404");
  }
});

// Create Book Route
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publish_date: req.body.publish_date,
    page_count: req.body.page_count,
    coverImageName: fileName,
    description: req.body.description
  });

  try {
    const newBook = await book.save();
    console.log("New Book added: ", newBook);
    res.redirect(`books/${newBook._id}`);
  } catch {
    if (book.coverImageName != null) removeBookCover(book.coverImageName);
    renderNewPage(res, book, true);
  }
});

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.log(err);
  });
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find();
    const params = {
      authorsList: authors,
      book: book
    };
    if (hasError) params.errMessage = "Error Creating Book";
    res.render("books/new", params);
  } catch {
    res.redirect("/books");
  }
}

module.exports = router;
