//publishers.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const PublisherModel = require('./model/publishers');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3003;

// MongoDB connection
mongoose.connect("mongodb+srv://khaledbahaa2012:a0RycYZtfXQnRfqB@cluster0.oli8qgt.mongodb.net/Grad", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Route to fetch all publishers
app.get("/getpublishers", async (req, res) => {
  try {
    const publishers = await PublisherModel.find();
    res.json(publishers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
