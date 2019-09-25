const express = require("express");
const router = express.Router();
const Author = require("../models/Author");
const Book = require("../models/Book");

// All Authors Route
router.get("/", async (req, res) => {
  // search
  let searchOptions = {};
  if (req.query.name !== null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authorsList: authors,
      searchOptions: req.query
    });
    // if (authors != null) {
    //   throw "No authors to display!";
    // }
  } catch {
    res.redirect("/");
  }
});

// New Author Route
router.get("/new", (req, res) => {
  res.render("authors/new", {
    author: new Author()
  });
});

// Get Author by ID
router.get("/:authorID", async (req, res) => {
  const author = await Author.findOne({
    _id: req.params.authorID
  });
  const books = await Book.find({
    author: author.id
  });
  try {
    res.render("authors/info", {
      author: author,
      booksList: books
    });
  } catch {
    res.render("404");
  }
});

// Create Author Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name
  });
  try {
    const isAuthor = await Author.findOne({
      name: req.body.name
    });
    if (isAuthor !== null) {
      throw "Author already exits!";
    }
    if (author.name === "") {
      throw "Author Name cannot be empty!";
    }
    const newAuthor = await author.save();
    // console.log("New Author Added: " + newAuthor);
    res.redirect(`/authors/${newAuthor._id}`);
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: err
    });
  }
});

router.get("/:authorID/edit", async (req, res) => {
  try {
    const author = await Author.findOne({
      _id: req.params.authorID
    });
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

// Edit Author
router.put("/:authorID", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.authorID);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    res.render("authors/edit", {
      author: author,
      errMessage: "Error Updating Author"
    });
  }
});

// Delete Author
router.delete("/:authorID", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.authorID);
    await author.remove();
    res.redirect("/authors");
  } catch (err) {
    res.render("authors/info", {
      author: author,
      errorMessage: err
    });
  }
});

module.exports = router;
