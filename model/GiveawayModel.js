const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const GiveawaySchema = new Schema({
    title: { type: String, required: true },
    poster: { type: String, required: true },
    participants: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }]
},
    { timestamps: true });

module.exports = model('Giveaway', GiveawaySchema);