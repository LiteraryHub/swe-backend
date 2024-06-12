//authors.js
const express = require("express");
const mongoose = require("mongoose");
const AuthorModel = require('./model/authors');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// MongoDB connection
mongoose.connect("mongodb+srv://khaledbahaa2012:a0RycYZtfXQnRfqB@cluster0.oli8qgt.mongodb.net/Grad", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Route to fetch authors with first name equal to "نجيب"
app.get("/getauthors", async (req, res) => {
  try {
    const authors = await AuthorModel.find({ first_name: "نجيب" });
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
