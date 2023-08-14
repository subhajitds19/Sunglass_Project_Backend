const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps:true})

const contactModel = new mongoose.model('contact', contactSchema);
module.exports = contactModel;