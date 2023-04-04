const mongoose = require('mongoose');

const Account = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    register_id: {type: String, required: true},
    register_as: {type: String, required: true},
    password: {type: String, required: true},
    
})

module.exports = mongoose.model("accounts", Account);
