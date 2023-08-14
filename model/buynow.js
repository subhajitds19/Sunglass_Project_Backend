const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BuySchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
     pincode: {
        type: String,
        required: false
    },
    contact: {
        type: String,
        required: false
    },
   
    status: {
        type: Boolean,
        default: true
    },
   
}, { timestamps: true })
const BuyModel = new mongoose.model('buyNow', BuySchema);
module.exports = BuyModel;