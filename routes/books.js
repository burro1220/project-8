const express = require('express');
const router = express.Router();
const Book = require("../models").Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET books listing. */
router.get('/', function(req, res, next) {
  Book.findAll({order: [["Year", "DESC"]]}).then(function(books){
    res.render("books/index", {books: books, title: "Check Out My Books" });
  }).catch(function(error){
      res.send(500, error);
   });
});

/* POST create book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book) {
     res.redirect("/books/");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("books/new-book", {book: Book.build(req.body), errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

/* Create a new book form. */
router.get('/new', function(req, res, next) {
  res.render("books/new-book", {book: {}, title: "New Book"});
});

/* GET Search for Book */
router.get("/search", (req, res) => {
  const { search } = req.query;
  Book.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${search}%`
          }
        },
        {
          author: {
            [Op.like]: `%${search}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${search}%`
          }
        },
        {
          year: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    }
  }).then(books => {
    console.log(books);
    if(books.length > 0) {
      res.render('books/index', {books: books, title: "Search Results"});
    } else {
      res.render('page-not-found', { book: {}, title: "Page Not Found" } );
    }
  }).catch(error => {
    res.status(500).send(error);
  });
});


/* GET individual book. */
router.get("/:id", function(req, res, next){
    Book.findByPk(req.params.id).then(function(book){
    if(book) {
        res.render("books/update-book", {book: book, title: book.title});  
    } else {
        res.render("page-not-found", { book: {}, title: "Page Not Found" });
    }
    }).catch(function(error){
        res.send(500, error);
    });
  });


  /* PUT update book. */
router.put("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(book){
    res.redirect("/books/");        
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        const book = Book.build(req.body);
        book.id = req.params.id;
        res.render("books/update-book", {book: book, errors: error.errors, title: "Edit Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* DELETE individual book. */
router.delete("/:id", function(req, res, next){
    Book.findByPk(req.params.id).then(function(book){  
      if(book) {
        return book.destroy();
      } else {
        res.send(404);
      }
    }).then(function(){
      res.redirect("/books");    
    }).catch(function(error){
        res.send(500, error);
     });
  });
  
  
module.exports = router;
  