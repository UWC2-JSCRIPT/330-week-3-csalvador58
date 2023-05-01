const { Router } = require("express");
const router = Router();

const bookDAO = require('../daos/book');

// Create
router.post("/", async (req, res, next) => {
  console.log('post /')
  const book = req.body;
  if (!book || JSON.stringify(book) === '{}' ) {
    res.status(400).send('book is required');
  } else {
    try {
      const savedBook = await bookDAO.create(book);
      res.json(savedBook); 
    } catch(e) {
      if (e instanceof bookDAO.BadDataError) {
        res.status(400).send(e.message);
      } else {
        res.status(500).send(e.message);
      }
    }
  }
});

// // Read - single book
// router.get("/:id", async (req, res, next) => {
//   console.log('get :id')
//   const book = await bookDAO.getById(req.params.id);
//   if (book) {
//     res.json(book);
//   } else {
//     res.sendStatus(404);
//   }
// });

// Read - all books
router.get("/", async (req, res, next) => {
  console.log('get /')
  let { page, perPage } = req.query;
  let query = req.query.authorId ? req.query.authorId : null;
  // console.log('query')
  // console.log(query)
  page = page ? Number(page) : 0;
  perPage = perPage ? Number(perPage) : 10;
  const books = await bookDAO.getAll(page, perPage, query);
  // console.log('books')
  // console.log(books)
  res.json(books);
});

// Stats
router.get("/authors/stats", async (req, res, next) => {
  console.log('get /authors/stats')
  let { page, perPage } = req.query;
  const authorInfoQuery = req.query.authorInfo;
  // console.log('authorInfoQuery')
  // console.log(authorInfoQuery)
  page = page ? Number(page) : 0;
  perPage = perPage ? Number(perPage) : 10;
  const statsByAuthor = await bookDAO.getStats(page, perPage, authorInfoQuery);
  // console.log('statsByAuthor')
  // console.log(statsByAuthor)
  res.json(statsByAuthor);
})

// Search
router.get("/search", async (req, res, next) => {
  console.log('get /search')
  let { page, perPage } = req.query;
  const searchQuery = req.query.query;
  // console.log('searchQuery')
  // console.log(searchQuery)

  page = page ? Number(page) : 0;
  perPage = perPage ? Number(perPage) : 10;
  const books = await bookDAO.getSearch(page, perPage, searchQuery);
  if(books.length > 0) {
    res.json(books);
  } else {
    res.status(500).send("No book was found");
  }
});

// Update
router.put("/:id", async (req, res, next) => {
  console.log('put :id')
  const bookId = req.params.id;
  const book = req.body;
  if (!book || JSON.stringify(book) === '{}' ) {
    res.status(400).send('book is required"');
  } else {
    try {
      const success = await bookDAO.updateById(bookId, book);
      res.sendStatus(success ? 200 : 400); 
    } catch(e) {
      if (e instanceof bookDAO.BadDataError) {
        res.status(400).send(e.message);
      } else {
        res.status(500).send(e.message);
      }
    }
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  console.log('delete :id')
  const bookId = req.params.id;
  try {
    const success = await bookDAO.deleteById(bookId);
    res.sendStatus(success ? 200 : 400);
  } catch(e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;