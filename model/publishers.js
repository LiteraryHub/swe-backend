const mongoose = require("mongoose")

const PublisherSchema = new mongoose.Schema({
    image: String,
    first_name: String,
    last_name: String,
    bio: String,
    about: String,
    followers: String,
})

const PublisherModel = mongoose.model("Publisher",PublisherSchema)
module.exports = PublisherModel