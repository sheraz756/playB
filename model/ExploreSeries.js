const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ExploreSeriesSchema = new Schema({
    series: { type: Schema.Types.ObjectId, ref: 'Series' },
    shortVideo: { type: String, required: true },
    likes: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }]
},
    { timestamps: true });

module.exports = model('ExploreSeries', ExploreSeriesSchema);