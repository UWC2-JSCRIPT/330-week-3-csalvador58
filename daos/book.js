const mongoose = require('mongoose');

const Book = require('../models/book');

module.exports = {};

module.exports.getAll = async (page, perPage, query) => {
  // console.log('DAOS - page');
  // console.log(page);
  // console.log(' DAOS - perPage');
  // console.log(perPage);
  // console.log('DAOS - query');
  // console.log(query);
  if (query) {
    // console.log('Process query');
    const books = await Book.find({ authorId: query }).limit(perPage).skip(perPage * page).lean();
    // console.log('DAOS - books');
    // console.log(books);
    return books;
  } else {
    // console.log('Find all');
    const books = await Book.find()
      .limit(perPage)
      .skip(perPage * page)
      .lean();
    return books;
  }
};

// // Search
// module.exports.getSearch = (page, perPage, searchQuery) => {
//   console.log("DAOS - searchQuery")
//   console.log(searchQuery)
//   if (searchQuery) {
//     Book.createIndexes({ title: 'text', genre: 'text', blurb: 'text' });
//     const results = Book.find(
//       { $text: { $search: searchQuery } },
//       { score: { $meta: 'textScore' } }
//     ).sort({ score: { $meta: 'textScore' } });
//     console.log('results');
//     console.log(results);
//     return null;
//   }

//   return null;
// };

module.exports.getById = async (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return null;
  }
  const book = await Book.findOne({ _id: bookId }).lean();
  return book;
};

module.exports.deleteById = async (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return false;
  }
  await Book.deleteOne({ _id: bookId });
  return true;
};

module.exports.updateById = async (bookId, newObj) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return false;
  }
  await Book.updateOne({ _id: bookId }, newObj);
  return true;
};

module.exports.create = async (bookData) => {
  try {
    const createdBook = await Book.create(bookData);
    return createdBook;
  } catch (e) {
    if (e.message.includes('validation failed')) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
