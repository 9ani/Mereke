const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: String,
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  category: { type: Schema.Types.ObjectId, ref: "category" },
  image: String,
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
}]
});
module.exports = mongoose.model("event", EventSchema);
