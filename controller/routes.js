const express = require('express');
const router = express.Router();
const user = require('../model/user');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy; // Add this line to import localStrategy

const userRoutes = require('./accountRoutes');
const { validationResult } = require('express-validator');


router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index", { logged: true });
    } else {
        res.render("index", { logged: false });
    }
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/signup', (req, res) => {
    res.render("signup");
});

router.post('/signup', async (req, res) => {
    try {
        let { email, username, password, confirmpassword, role } = req.body;
        email = email.toLowerCase();


        // Validate input using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        // Check if password and confirm password match
        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Password and Confirm Password don't match" });
        }

        // Check if a user with the same email or username already exists
        const existingUser = await user.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same email or username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Save user in the database
        const newUser = new user({
            username,
            email,
            password: hashedPassword,
            provider: 'email',
            role, // Add the chosen role to the user
        });

        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: 'User registered successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Login API
router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    // Convert email to lowercase
        email = email.toLowerCase();

    try {
        // Find the user in the database
        const foundUser = await user.findOne({ email });

        if (!foundUser) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        // Compare the provided password with the hashed password stored in the database
        const match = await bcryptjs.compare(password, foundUser.password);

        if (match) {
            return res.status(200).json({ message: 'Login successful', user: foundUser });
        } else {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});


router.use(userRoutes);

module.exports = router;
