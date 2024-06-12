const mongoose = require("mongoose")

const AuthorSchema = new mongoose.Schema({
    image: String,
    first_name: String,
    last_name: String,
    bio: String,
    about: String,
    followers: String
})

const AuthorModel = mongoose.model("Author",AuthorSchema)
module.exports = AuthorModel