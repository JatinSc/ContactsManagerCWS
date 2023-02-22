// # to connect to our database
const mongoose = require('mongoose');
require('dotenv').config({path : './config/.env'})
const connectDB =  () =>{
   mongoose.connect(process.env.mongoAtlas,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('connection to database established '))
    .catch((err) => console.log(err))
}

module.exports = connectDB;
