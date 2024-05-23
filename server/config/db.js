const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://gani:qwerty123456@weatherapi.qd1uz2q.mongodb.net/mereke?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});