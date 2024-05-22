const mongoose = require('mongoose');
const Schema = mongoose.Schema

const RateSchema = new mongoose.Schema({
    rate: Number,
    text: String,
    eventId:  {type: Schema.Types.ObjectId , ref: 'event'},
    authorId: {type: Schema.Types.ObjectId , ref: 'user'}
})


module.exports = mongoose.model('rate', RateSchema)