const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const FundingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    ammount: { type: String, required: true },
},
    { timestamps: true });

module.exports = model('Funding', FundingSchema);