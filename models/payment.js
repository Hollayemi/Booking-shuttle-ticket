const mongoose = require('mongoose');

const PayStackPayment = new mongoose.Schema({
    access_code: {type: String, required: true},
    ride_code: {type: String, required: true},
    reference: {type: String, required: true},
    payloadData: {type: Object, required: true},
    authorization_url: {type: String, required: true},
})

module.exports = mongoose.model("PayStackPayments", PayStackPayment);
