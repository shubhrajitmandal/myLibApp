const mongoose = require("mongoose");
const Book = require("./Book");
const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    collection: "authors"
  }
);

authorSchema.pre("remove", async function() {
  const books = await Book.find({ author: this.id });
  if (books.length > 0) {
    throw "Error! There are books from this author!";
  }
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
