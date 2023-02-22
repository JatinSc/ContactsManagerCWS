const mongoose = require('mongoose')
const Joi = require('joi');


const ContactModal = new mongoose.Schema({
  name : {
    type : String,
    required : [true , 'name is required']
  },
  address : {
    type : String,
    required : [true , 'address is required']
  },
  email : {
    type : String,
    required : [true , 'email is required']
  },
  phone : {
    type : Number,
    required : [true , 'phone number is required']
  },
  postedBy :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "UserDetails" 
  }
})

const Contact = mongoose.model('ContactDetails', ContactModal)

//# for validating the data entered by the user by using joi library
const validateContact = (data) => {
const schema = Joi.object({
    name : Joi.string().min(4).max(50).required(),
    address : Joi.string().min(4).max(100).required(),
    email : Joi.string().email().required(),
    phone : Joi.number().min(7).max(10000000000).required()
})
return schema.validate(data)
}

module.exports = {
    validateContact,
    Contact
};