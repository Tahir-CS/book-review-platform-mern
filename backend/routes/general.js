const express = require('express');
let { books, users } = require("./database.js");
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!users.find(u => u.username === username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(409).json({ message: "User already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register user. Please provide username and password." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const authorBooks = [];
    for (const key in books) {
        if (books[key].author === author) {
            authorBooks.push(books[key]);
        }
    }
    if (authorBooks.length > 0) {
        res.send(authorBooks);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const titleBooks = [];
    for (const key in books) {
        if (books[key].title === title) {
            titleBooks.push(books[key]);
        }
    }
    if (titleBooks.length > 0) {
        res.send(titleBooks);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "Reviews not found for this book" });
    }
});

module.exports.general = public_users;
