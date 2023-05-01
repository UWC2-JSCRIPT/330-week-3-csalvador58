const mongoose = require('mongoose');

const Author = require('../models/author');

module.exports = {};

module.exports.getAll = async (page, perPage) => {
  const authors = Author.find().limit(perPage).skip(perPage*page).lean();
  return authors;
}

module.exports.getById = async (authorId) => {
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return null;
  }
  const author = await Author.findOne({ _id: authorId }).lean();
  return author;
}

module.exports.deleteById = async (authorId) => {
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return false;
  }
  await Author.deleteOne({ _id: authorId });
  return true;
}

module.exports.updateById = async (authorId, newObj) => {
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return false;
  }
  await Author.updateOne({ _id: authorId }, newObj);
  return true;
}

module.exports.create = async (authorData) => {
  try {
    const createdAuthor = await Author.create(authorData);
    return createdAuthor;
  } catch (e) {
    if (e.message.includes('validation failed')) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;