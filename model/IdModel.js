const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    username: { type: String },
    phoneNumber: { type: String },
    country: { type: String },
    plan: { type: String },
    ammount: { type: Number },
    userId:{type: String},
    imgPic: { type: String },

}, { timestamps: true });


module.exports = mongoose.model('streamerid', IdSchema);