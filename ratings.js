const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RatingModel = require('./model/ratings');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://khaledbahaa2012:a0RycYZtfXQnRfqB@cluster0.oli8qgt.mongodb.net/Grad");

// GET endpoint to retrieve ratings
app.get("/getRatings", async (req, res) => {
    try {
        const ratings = await RatingModel.find();
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST endpoint to add ratings
app.post("/addRating", async (req, res) => {
    const { rate, review } = req.body;
    const rating = new RatingModel({ rate, review });
    try {
        const newRating = await rating.save();
        res.status(201).json(newRating);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(3002, () => {
    console.log("Server is running");
});
