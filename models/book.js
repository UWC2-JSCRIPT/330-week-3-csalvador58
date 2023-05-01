const mongoose = require('mongoose');

const Author = require('./author');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  ISBN: { type: String, required: true, unique: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'authors',
    required: true,
  },
  blurb: { type: String },
  publicationYear: { type: Number, required: true },
  pageCount: { type: Number, required: true },
});

// create index for authorId
bookSchema.index({ authorId: 1 });

// create text index
bookSchema.index({ title: 'text', genre: 'text', blurb: 'text' });

module.exports = mongoose.model('books', bookSchema);
