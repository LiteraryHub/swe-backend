//authors_search.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AuthorModel = require('./model/authors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://khaledbahaa2012:a0RycYZtfXQnRfqB@cluster0.oli8qgt.mongodb.net/Grad");

// Endpoint for server-side search filtering and pagination
app.get("/getauthors", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
    const limit = 5; // Maximum number of documents per page

    const searchTerm = req.query.search || ''; // Search term from query parameter, default to empty string if not provided

    try {
        let query = {}; // Initial query object

        if (searchTerm !== '') {
            // If search term is provided, construct query to search by book title
            query = {
                $or: [
                    { first_name: { $regex: searchTerm, $options: 'i' } },
                    { last_name: { $regex: searchTerm, $options: 'i' } }
                ]
            };
        }

        const totalCount = await AuthorModel.countDocuments(query); // Total number of documents in the collection based on the query

        const totalPages = Math.ceil(totalCount / limit); // Total number of pages

        const authors = await AuthorModel.find(query)
            .skip((page - 1) * limit) // Skip documents based on the current page
            .limit(limit); // Limit the number of documents returned per page

        res.json({
            authors,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        console.error("Error fetching authors:", err.message);
        res.status(500).json({ message: err.message });
    }
});

app.listen(3004, () => {
    console.log("Server is running");
});
