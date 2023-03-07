const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AdSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    adPoster: { type: String, required: true },
    validity: { type: Number, required: true },
    isActive: { type: Boolean, default: false }
},
    { timestamps: true });

module.exports = model('Ad', AdSchema);