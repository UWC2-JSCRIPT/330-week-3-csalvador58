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
    const books = await Book.find({ authorId: query })
      .limit(perPage)
      .skip(perPage * page)
      .lean();
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

module.exports.getById = async (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return null;
  }
  const book = await Book.findOne({ _id: bookId }).lean();
  return book;
};

// Search
module.exports.getSearch = async (page, perPage, searchQuery) => {
  // console.log("DAOS - searchQuery")
  // console.log(searchQuery)
  if (searchQuery) {
    // console.log('Searching for query...')
    const searchResults = await Book.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    // console.log('searchResults');
    // console.log(searchResults);
    return searchResults;
  }

  return null;
};

module.exports.getStats = async () => {
  const statsByAuthor = Book.aggregate([
    {
      $group: {
        _id: '$authorId', // Group key
        averagePageCount: { $avg: '$pageCount' }, // use $avg accumulator operator for average
        numBooks: { $count: {} }, // use $count accumulator operator to total documents in group
        titles: { $push: '$title' }, // use $push accumulator op to include array of titles
      },
    },
    {
      $project: {
        // project to specify fields to include/remove
        _id: 0, // remove _id field
        authorId: '$_id', // update _id to authorId
        averagePageCount: 1, // include field
        numBooks: 1, // include field
        titles: 1, // include field
      },
    },
  ]);

  return statsByAuthor;
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
