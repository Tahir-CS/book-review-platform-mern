const express = require('express');
const jwt = require('jsonwebtoken');
let { books, users } = require("./database.js");
const regd_users = express.Router();

// Login as a registered user
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    let authenticatedUser = users.find(u => u.username === username && u.password === password);

    if (authenticatedUser) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review successfully posted");
    }
    else {
        return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        if (book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).send("Review successfully deleted");
        }
        else {
            return res.status(404).json({ message: "Review not found for this user" });
        }
    }
    else {
        return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
});

module.exports.authenticated = regd_users;
