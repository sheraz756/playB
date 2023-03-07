const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ExploreMovieSchema = new Schema({
    movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
    shortVideo: { type: String, required: true },
    likes: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
},
    { timestamps: true });

module.exports = model('ExploreMovie', ExploreMovieSchema);