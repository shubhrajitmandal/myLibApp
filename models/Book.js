const mongoose = require("mongoose");
const path = require("path");

const coverImageBasePath = "uploads/bookCovers";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    publish_date: {
      type: Date,
      required: true
    },
    page_count: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    coverImageName: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author"
    }
  },
  {
    collection: "books"
  }
);

bookSchema.virtual("coverImagePath").get(function() {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
module.exports.coverImageBasePath = coverImageBasePath;
