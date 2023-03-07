const express = require('express');
const router = express.Router();
const UserModel = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const isEmail = require('validator/lib/isEmail');

const options = {
    auth: {
        api_key: process.env.SENDGRID_API
    }
}

const transpoter = nodemailer.createTransport(sendGridTransport(options));

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!isEmail(email)) return res.status(401).send('Invalid Email');
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).send('User not found!');

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        await user.save();
        const playeonUrl = `https://www.playeon.com/reset/${token}`;
        const dashboardUrl = `https://dashboard.playeon.com/reset/${token}`;
        const href = user.role === 'user' ? playeonUrl : dashboardUrl;
        const mailOptions = {
            to: user.email,
            from: 'playeonteam@gmail.com',
            subject: 'Password Reset Request!',
            html: `<p>Hey ${user.name}, There was a request for password reset. <a href=${href}>Click this link to reset the passowrd.</a></p> <p>This token is valid for 1 hour only.</p>`
        }
        transpoter.sendMail(mailOptions, (err, info) => err && console.log(err));
        return res.status(200).send('Email sent successfully!')

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
})


router.post('/loggedinuser', async (req, res) => {
    try {
        const { email } = req.body;
        if (!isEmail(email)) return res.status(401).send('Invalid Email');
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).send('User not found!');
        user.isLoggedIn = false;
        await user.save();
        return res.status(200).send('Email sent successfully!')

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
})

router.post('/token', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token) return res.status(401).send('Unauthorized');
        if (password.length < 5) return res.status(401).send('Password must be atleast 5 characters');
        const user = await UserModel.findOne({ resetToken: token });
        if (!user) return res.status(404).send('User not found!');
        if (Date.now() > user.expireToken) return res.status(401).send('Token expired. Generate new!');
        user.password = await bcrypt.hash(password, 10);
        user.resetToken = '';
        user.expireToken = undefined;
        await user.save();
        return res.status(200).send('Password changed successfully!');
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
})

module.exports = router

// const dashboardUrl = `https://dashboard.playeon.com/reset/${token}`;
// const playeonUrl = `https://playeon.com/reset/${token}`;











// router.post('/support', async (req, res) => {
//     try {
//         const { email } = req.body;
//         if (!isEmail(email)) return res.status(401).send('Invalid Email');
//         const user = await UserModel.findOne({ email: email.toLowerCase() });
//         if (!user) return res.status(404).send('User not found!');

//         const token = crypto.randomBytes(32).toString('hex');
//         user.resetToken = token;
//         user.expireToken = Date.now() + 3600000;
//         await user.save();
//         const dashboardUrl = `https://dashboard.playeon.com/reset/${token}`;
//         const href = 'http://localhost:3000/reset/${token}'
//         const mailOptions = {
//             to: user.email,
//             from: 'mbmemon123@gmail.com',
//             subject: 'Password Reset Request!',
//             html: `<p>Hey ${user.name}, There was a request for password reset. <a href=${href}>Click this link to reset the passowrd.</a></p> <p>This token is valid for 1 hour only.</p>`
//         }
//         transpoter.sendMail(mailOptions, (err, info) => err && console.log(err));
//         return res.status(200).send('Email sent successfully!')

//     } catch (error) {
//         console.error(error);
//         return res.status(500).send("Server Error");
//     }
// })