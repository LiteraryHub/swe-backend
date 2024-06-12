//main.js
// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Combine model definitions for books and ratings into one file
const { BookModel, RatingModel } = require('./model/main');

// Create an Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Connect to MongoDB database
mongoose.connect("mongodb+srv://khaledbahaa2012:a0RycYZtfXQnRfqB@cluster0.oli8qgt.mongodb.net/Grad");

// Define endpoints

// Endpoint for server-side search filtering and pagination for books
app.get("/getBooks", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
    const limit = 5; // Maximum number of documents per page
    const searchTerm = req.query.search || ''; // Search term from query parameter, default to empty string if not provided

    try {
        let query = {}; // Initial query object

        if (searchTerm !== '') {
            // If search term is provided, construct query to search by book title
            query = { title: { $regex: searchTerm, $options: 'i' } }; // Case-insensitive regex search
        }

        const totalCount = await BookModel.countDocuments(query); // Total number of documents in the collection based on the query
        const totalPages = Math.ceil(totalCount / limit); // Total number of pages

        const books = await BookModel.find(query)
            .skip((page - 1) * limit) // Skip documents based on the current page
            .limit(limit); // Limit the number of documents returned per page

        console.log("Total Books:", totalCount);
        console.log("Total Pages:", totalPages);
        console.log("Current Page:", page);
        console.log("Books Retrieved:", books);

        res.json({
            books,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        console.error("Error fetching books:", err.message);
        res.status(500).json({ message: err.message });
    }
});

    // GET endpoint to retrieve ratings for a specific book
    app.get("/getRatings", async (req, res) => {
        const { bookId } = req.query; // Retrieve bookId from query parameters
        try {
            if (!bookId) {
                return res.status(400).json({ message: "BookId is required" });
            }
            const ratings = await RatingModel.find({ bookId: bookId });
            res.json(ratings);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

// POST endpoint to add ratings for a specific book
app.post("/addRating", async (req, res) => {
    const { rate, review, bookId } = req.body;
    try {
        console.log("Received request body:", req.body);
        console.log("Rate:", rate);
        console.log("Review:", review);
        console.log("Book ID:", bookId);

        // Ensure that bookId is converted to ObjectId type if necessary
        const convertedBookId = mongoose.Types.ObjectId(bookId);

        const rating = new RatingModel({ rate, review, bookId: convertedBookId });
        console.log("New Rating Object:", rating);

        const newRating = await rating.save();
        console.log("New Rating Saved:", newRating);

        const book = await BookModel.findById(convertedBookId);
        console.log("Found Book:", book);

        if (!book) {
            console.log("Book not found");
            return res.status(404).json({ message: "Book not found" });
        }

        console.log("Book ratingsReviewsIds before update:", book.ratingsReviewsIds);
        
        if (!book.ratingsReviewsIds) {
            book.ratingsReviewsIds = [];
        }

        book.ratingsReviewsIds.push(newRating._id);
        await book.save();
        console.log("Book updated with new rating:", book);

        res.status(201).json(newRating);
    } catch (err) {
        console.error("Error adding rating:", err);
        res.status(400).json({ message: err.message });
    }
});

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
