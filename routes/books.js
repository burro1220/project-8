const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

/* GET books listing. */
router.get('/', function(req, res, next) {
  Book.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
    res.render("books/index", {books: books, title: "Check Out My Books" });
  }).catch(function(error){
      res.send(500, error);
   });
});

/* POST create book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book) {
    res.redirect("/books/" + book.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("books/new", {book: Book.build(req.body), errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

/* Create a new book form. */
router.get('/new', function(req, res, next) {
  res.render("books/new", {book: {}, title: "New Book"});
});

/* Delete book form. */
router.get("/:id/delete", function(req, res, next){
    Book.findById(req.params.id).then(function(book){  
      if(book) {
        res.render("books/delete", {book: book, title: "Delete Book"});
      } else {
        res.send(404);
      }
    }).catch(function(error){
        res.send(500, error);
     });
  });
  
  
/* GET individual book. */
router.get("/:id", function(req, res, next){
    Book.findById(req.params.id).then(function(book){
    if(book) {
        res.render("books/show", {book: book, title: book.title});  
    } else {
        res.send(404);
    }
    }).catch(function(error){
        res.send(500, error);
    });
  });

/* DELETE individual book. */
router.delete("/:id", function(req, res, next){
    Book.findById(req.params.id).then(function(book){  
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
  