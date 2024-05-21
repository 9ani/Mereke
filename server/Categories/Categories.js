const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    key: Number,
})


module.exports = mongoose.model('category', categorySchema)