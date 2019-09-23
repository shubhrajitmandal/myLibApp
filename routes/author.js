const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

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
      authorList: authors,
      searchOptions: req.query
    });
    if (!authors) {
      throw "No authors to display!";
    }
  } catch (err) {
    console.log(err);
    res.render("error");
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
  try {
    res.render("authors/info", {
      author: author
    });
  } catch (err) {
    console.log(err);
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
    console.log("New Author Added: " + newAuthor);
    res.redirect(`/authors/${newAuthor._id}`);
  } catch (err) {
    console.log(err);
    res.render("authors/new", {
      author: author,
      errMessage: err
    });
  }
});

module.exports = router;
