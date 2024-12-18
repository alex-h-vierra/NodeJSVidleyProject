const mongoose = require('mongoose');
const Joi = require('joi'); 

function validateCustomer (customer){
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    });
    return schema.validate(customer);
}

const Customer = mongoose.model('courses', new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

exports.Customer = Customer;
exports.validate = validateCustomer;