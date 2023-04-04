const mongoose = require('mongoose')

const addPickUp = new mongoose.Schema({
    pick_location: {type: String, required: true},
    destination: {type: String, required: true},
    userId: {type: mongoose.SchemaTypes.ObjectId, required: true},
    time: {type: String, required: true},
    number_of_students: {type: String, required: true},
    ride_code: {type: String, required: true},
    payment: {type: String, required: true},
    pickedBy: {type: String, default: "waiting"},
}, {
    timestamps: true,
})

module.exports = mongoose.model("pick_ups", addPickUp);
