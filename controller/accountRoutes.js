const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const resetToken = require('../model/resetTokens');
const user = require('../model/user');
const mailer = require('./sendMail');
const bcryptjs = require('bcryptjs');

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Please Login to continue !");
        res.redirect('/login');
    }
}

// adding the checkAuth middleware to make sure that 
// only authenticated users can send emails
router.get('/user/send-verification-email', checkAuth, async (req, res) => {
    // check if user is google or already verified
    if (req.user.isVerified || req.user.provider == 'google') {
        // already verified or google user
        // since we won't show any such option in the UI 
        // most probably this is being called by mistake or can be an attack
        // simply redirect to profile 
        res.redirect('/profile');
    } else {
        // generate a token 
        var token = crypto.randomBytes(32).toString('hex');
        // add that to the database
        await resetToken({ token: token, email: req.user.email }).save();
        // send an email for verification
        mailer.sendVerifyEmail(req.user.email, token);
        res.render('profile', { username: req.user.username, verified: req.user.isVerified, emailsent: true });
    }
});

router.get('/user/verifyemail', async (req, res) => {
    // grab the token
    const token = req.query.token;
    // check if token exists 
    // or just send an error
    if (token) {
        var check = await resetToken.findOne({ token: token });
        if (check) {
            // token verified
            // set the property of verified to true for the user
            var userData = await user.findOne({ email: check.email });
            userData.isVerified = true;
            await userData.save();
            // delete the token now itself
            await resetToken.findOneAndDelete({ token: token });
            res.redirect('/profile');
        } else {
            res.render('profile', { username: req.user.username, verified: req.user.isVerified, err: "Invalid token or Token has expired, Try again." });
        }
    } else {
        // doesn't have a token
        // I will simply redirect to the profile 
        res.redirect('/profile');
    }
});

router.get('/user/forgot-password', async (req, res) => {
    // render the reset password page 
    // not checking if the user is authenticated 
    // so that you can use it as an option to change the password too
    res.render('forgot-password.ejs');
});

router.post('/user/forgot-password', async (req, res) => {
    const { email } = req.body;
    // not checking if the field is empty or not 
    // check if a user exists with this email
    var userData = await user.findOne({ email: email });
    console.log(userData);
    if (userData) {
        if (userData.provider == 'google') {
            // type is for bootstrap alert types
            res.render('forgot-password.ejs', { msg: "User exists with a Google account. Try resetting your Google account password or logging in using it.", type: 'danger' });
        } else {
            // user exists and is not with Google
            // generate a token
            var token = crypto.randomBytes(32).toString('hex');
            // add that to the database
            await resetToken({ token: token, email: email }).save();
            // send an email for verification
            mailer.sendResetEmail(email, token);

            res.render('forgot-password.ejs', { msg: "Reset email sent. Check your email for more info.", type: 'success' });
        }
    } else {
        res.render('forgot-password.ejs', { msg: "No user exists with this email.", type: 'danger' });
    }
});

router.get('/user/reset-password', async (req, res) => {
    // do as in user verify, first check for a valid token 
    // and if the token is valid send the forgot password page to show the option to change the password 
    const token = req.query.token;
    if (token) {
        var check = await resetToken.findOne({ token: token });
        if (check) {
            // token verified
            // send the forgot-password page with reset to true
            // this will render the form to reset the password
            // sending the token too to grab the email later
            res.render('forgot-password.ejs', { reset: true, email: check.email });
        } else {
            res.render('forgot-password.ejs', { msg: "Token tampered or expired.", type: 'danger' });
        }
    } else {
        // doesn't have a token
        // I will simply redirect to the login 
        res.redirect('/login');
    }
});

router.post('/user/reset-password', async (req, res) => {
    // get passwords
    const { password, password2, email } = req.body;
    console.log(password);
    console.log(password2);
    if (!password || !password2 || (password2 != password)) {
        res.render('forgot-password.ejs', { reset: true, err: "Passwords don't match!", email: email });
    } else {
        // encrypt the password
        var salt = await bcryptjs.genSalt(12);
        if (salt) {
            var hash = await bcryptjs.hash(password, salt);
            await user.findOneAndUpdate({ email: email }, { $set: { password: hash } });
            res.redirect('/login');
        } else {
            res.render('forgot-password.ejs', { reset: true, err: "Unexpected error. Try again.", email: email });
        }
    }
});

module.exports = router;
