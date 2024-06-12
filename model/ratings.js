const mongoose = require("mongoose")

const RatingSchema = new mongoose.Schema({
    rate: Number,
    review: String
}, { versionKey: false });

const RatingModel = mongoose.model("RatingsReviews",RatingSchema)
module.exports = RatingModel