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
    coverImage: {
      type: Buffer,
      required: true
    },
    coverImageType: {
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

// server file system storage
// bookSchema.virtual("coverImagePath").get(function() {
//   if (this.coverImageName != null) {
//     return path.join("/", coverImageBasePath, this.coverImageName);
//   }
// });

// database storage
bookSchema.virtual("coverImagePath").get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
module.exports.coverImageBasePath = coverImageBasePath;
