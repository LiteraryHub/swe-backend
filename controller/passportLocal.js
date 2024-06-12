// Importing the User model from '../model/user'
const user = require('../model/user');
const bcryptjs = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

// Exporting a function that initializes Passport with a local strategy
module.exports = function (passport) {
    // Configuring a new local strategy with usernameField set to 'email'
    passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Finding a user by email in the database
        user.findOne({ email: email }, (err, data) => {
            if (err) throw err;

            // If user doesn't exist, return an error message
            if (!data) {
                return done(null, false, { message: "User Doesn't Exist !" });
            }

            // Comparing the provided password with the hashed password stored in the database
            bcryptjs.compare(password, data.password, (err, match) => {
                if (err) {
                    return done(null, false);
                }

                // If passwords don't match, return an error message
                if (!match) {
                    return done(null, false, { message: "Password Doesn't match !" });
                }

                // If the passwords match, return the user data
                if (match) {
                    return done(null, data);
                }
            });
        });
    }));

    // Serialize user data to store in the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize user data to retrieve from the session
    passport.deserializeUser(function (id, done) {
        user.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
