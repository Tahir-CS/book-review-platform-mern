const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/books/isbn/:isbn
// @desc    Get book by ISBN
// @access  Public
router.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = await Book.findOne({ isbn: req.params.isbn });
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/books/author/:author
// @desc    Get books by author
// @access  Public
router.get('/author/:author', async (req, res) => {
    try {
        const books = await Book.find({ author: new RegExp(req.params.author, 'i') });
        if (!books || books.length === 0) {
            return res.status(404).json({ msg: 'No books found for this author' });
        }
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/books/title/:title
// @desc    Get books by title
// @access  Public
router.get('/title/:title', async (req, res) => {
    try {
        const books = await Book.find({ title: new RegExp(req.params.title, 'i') });
        if (!books || books.length === 0) {
            return res.status(404).json({ msg: 'No books found with this title' });
        }
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
