const mongoose = require("mongoose")

const BookSchema = new mongoose.Schema({
    _id:String,
    img : String,
    title : String,
    author_name : String,
    summary:String,
    price:String,
    rating:Number,
    date: String,
    reader:String
})

const BookModel = mongoose.model("Book",BookSchema)
module.exports = BookModel