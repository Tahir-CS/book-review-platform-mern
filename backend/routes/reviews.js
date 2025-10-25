const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const auth = require('../Middleware/auth');

// @route   GET api/reviews/:isbn
// @desc    Get all reviews for a book
// @access  Public
router.get('/:isbn', async (req, res) => {
    try {
        const book = await Book.findOne({ isbn: req.params.isbn });
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        const reviews = await Review.find({ book: book._id }).populate('user', ['username']);
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/reviews/:isbn
// @desc    Add a review for a book
// @access  Private
router.post('/:isbn', auth, async (req, res) => {
    const { reviewText, rating } = req.body;

    try {
        const book = await Book.findOne({ isbn: req.params.isbn });
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        const newReview = new Review({
            reviewText,
            rating,
            user: req.user.id,
            book: book._id
        });

        const review = await newReview.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/reviews/:review_id
// @desc    Update a review
// @access  Private
router.put('/:review_id', auth, async (req, res) => {
    const { reviewText, rating } = req.body;

    try {
        let review = await Review.findById(req.params.review_id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Make sure user owns the review
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        review = await Review.findByIdAndUpdate(
            req.params.review_id,
            { $set: { reviewText, rating } },
            { new: true }
        );

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/reviews/:review_id
// @desc    Delete a review
// @access  Private
router.delete('/:review_id', auth, async (req, res) => {
    try {
        let review = await Review.findById(req.params.review_id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Make sure user owns the review
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Review.findByIdAndRemove(req.params.review_id);

        res.json({ msg: 'Review removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
