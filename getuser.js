// getuser.js

// Load environment variables
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors middleware

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3008;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: String
}, { collection: 'User' }); // Specify collection name as 'User'

// Create user model
const User = mongoose.model('User', userSchema);

// Apply CORS middleware to allow requests from all origins
app.use(cors());

// Define API endpoint to get user role by email
app.get('/api/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user's role
    res.json({ role: user.role });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
