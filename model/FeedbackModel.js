const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const FeedbackSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    status: { type: Boolean, default: false }
},
    { timestamps: true });

module.exports = model('Feedback', FeedbackSchema);