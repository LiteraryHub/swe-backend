const mongoose = require("mongoose");

// Define Book Schema
const BookSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    img: String,
    title: String,
    author_name: String,
    summary: String,
    price: String,
    rating: Number,
    date: String,
    reader: String,
    ratingsReviewsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RatingsReviews' }]
}, { versionKey: false });

// Define Rating Schema
const RatingSchema = new mongoose.Schema({
    rate: Number,
    review: String,
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
}, { versionKey: false });

// Create Book Model
const BookModel = mongoose.model("Book", BookSchema);

// Create Rating Model
const RatingModel = mongoose.model("RatingsReviews", RatingSchema);

// Export both models
module.exports = { BookModel, RatingModel };  