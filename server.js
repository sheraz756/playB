const express = require('express');
const connectDb = require('./utilServer/connectDb');
const app = express();
require('dotenv').config({ path: './config.env' });
const port = 5000 || process.env.PORT;
const signupRoute = require('./routes/signup');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const staffRoute = require('./routes/staff');
const movieRoute = require('./routes/movie');
const fundingRoute = require('./routes/funding');
const feedbackRoute = require('./routes/feedback');
const requestRoute = require('./routes/request');
const adRoute = require('./routes/ad');
const voucherRoute = require('./routes/voucher');
const giveawayRoute = require('./routes/giveaway');
const profileRoute = require('./routes/profile');
const seriesRoute = require('./routes/series');
const uploadPictureRoute = require('./routes/uploadpictures');
const searchRoute = require('./routes/search');
const resetRoute = require('./routes/reset');
const exploreRoute = require('./routes/explore');
const exploreMovieRoute = require('./routes/exploreMovie');
const exploreSeriesRoute = require('./routes/exploreSeries');
const bdo = require('./routes/Bdo')
const cors = require('cors');
const cluster = require('cluster');
const totalCpus = require('os').cpus().length;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
connectDb();


app.use('/api/v1/signup', signupRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/staff', staffRoute);
app.use('/api/v1/movie', movieRoute);
app.use('/api/v1/funding', fundingRoute);
app.use('/api/v1/feedback', feedbackRoute);
app.use('/api/v1/request', requestRoute);
app.use('/api/v1/ad', adRoute);
app.use('/api/v1/voucher', voucherRoute);
app.use('/api/v1/giveaway', giveawayRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/series', seriesRoute);
app.use('/api/v1/uploadPicture', uploadPictureRoute);
app.use('/api/v1/search', searchRoute);
app.use('/api/v1/reset', resetRoute);
app.use('/api/v1/explore', exploreRoute);
app.use('/api/v1/exploreMovie', exploreMovieRoute);
app.use('/api/v1/exploreSeries', exploreSeriesRoute);
app.use('/api/v1/bdo',bdo)


app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Server running at http://localhost:${port}`);
})