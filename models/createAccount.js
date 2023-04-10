const mongoose = require('mongoose');

const Account = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    register_id: {type: String, required: true},
    register_as: {type: String, required: true},
    password: {type: String, required: true},
    wallet: {type: Number, default: 0},
})

module.exports = mongoose.model("accounts", Account);
