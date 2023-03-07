const mongoose = require('mongoose');
const { Schema } = mongoose;

const BdoSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    username: { type: String },
    phoneNumber: { type: String },
    BdoId:{type: String},
    imgPic: { type: String },

}, { timestamps: true });


module.exports = mongoose.model('Bdo', BdoSchema);