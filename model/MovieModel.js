const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MovieSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: String, required: true },
    type: { type: String },
    duration: { type: String, required: true },
    imgLgPoster: { type: String, required: true },
    imgSmPoster: { type: String, required: true },
    subtitle: { type: String },
    trailer: { type: String, required: true },
    video: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
    dislikes: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
    watchlater: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
    genre: { type: String, required: true },
},
    { timestamps: true });

module.exports = model('Movie', MovieSchema);