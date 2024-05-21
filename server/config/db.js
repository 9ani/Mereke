const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/mereke').then(() =>
{
    console.log('Connected to Mongodb')
}).catch((e)=>
{
    console.log('Failed to connect to Mongodb')
});