const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userModal = new Schema({
    name:{
        type:String,
        required : [true , 'name is required']
    },
    email:{
        type:String,
        required : [true , 'email is required'],
        unique : [true , 'user with this email address already exists']
    },
    password:{
        type:String,
        required : [true , 'password is required'],
    }
})

const user = new mongoose.model('UserDetails', userModal);
module.exports = user;