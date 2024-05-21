const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new mongoose.Schema({
    email: String,
    full_name: String,
    password: String,
    isAdmin: Boolean,
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'event',
    }] 

})

module.exports = mongoose.model('user', UserSchema)