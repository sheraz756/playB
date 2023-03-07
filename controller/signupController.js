const UserModel = require('../model/UserModel');
const jwt = require('jsonwebtoken'); // Json web token
const bcrypt = require('bcryptjs');// For Encrypting password
const isEmail = require('validator/lib/isEmail');// For Email validation test
// Regex expression text for username
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
// Default profile picture
const defaultProfilePicture = 'https://playeon-assest.s3.ap-south-1.amazonaws.com/defaulticon.png';
const VoucherModel = require('../model/VoucherModel');

exports.getUsername = async (req, res) => {
    const { username } = req.params;
    try {
        if (username.length < 1) return res.status(401).send('Invalid');
        if (!regexUserName.test(username)) return res.status(401).send('Test Failed');
        const user = await UserModel.findOne({ username: username.toLowerCase() });
        if (user) return res.status(401).send('Username Already Exist');
        return res.status(200).send('Available');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}

exports.signupByAdmin = async (req, res) => {
    const { name, email, username, password, phoneNumber, country, plan, paymentMethod, voucher } = req.body.user;
    if (!isEmail(email)) return res.status(401).send('Invalid Email');
    if (password.length < 4) return res.status(401).send('Password must be atleast 6 characters');
    try {
        const userEmail = await UserModel.findOne({ email: email.toLowerCase() });
        if (userEmail) return res.status(401).send('User already registered');
        const voucherCode = await VoucherModel.findOne({ code: voucher });
        if (!voucherCode) return res.status(401).send('Invalid Voucher Code. Please Try Again');
        if (voucherCode.isActive) return res.status(404).send('Unauthorized');
        const voucherValidTillDays = voucherCode.validtill;
        const today = new Date();
        const voucherExpiry = today.setDate(today.getDate() + voucherValidTillDays);
        let user;
        user = new UserModel({
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            country,
            phoneNumber,
            profilePicture: defaultProfilePicture,
            plan,
            paymentMethod,
            voucherExpiryDate: voucherExpiry,
        });

        await VoucherModel.updateOne({ code: voucher }, {
            isActive: true,
            expiry: voucherExpiry
        });

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        // payload
        const payload = { userId: user._id };
        jwt.sign(payload, process.env.jwtSecret, { expiresIn: '2d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}

exports.registerUserWithVoucher = async (req, res) => {
    const { name, email, username, password, phoneNumber, country, plan, paymentMethod, voucher,BdoId } = req.body.user;
    try {
        const voucherCode = await VoucherModel.findOne({ code: voucher });
        if (!voucherCode) return res.status(401).send('Invalid Voucher Code. Please Try Again');
        if (voucherCode.isActive) return res.status(404).send('Unauthorized');
        const voucherValidTillDays = voucherCode.validtill;
        const today = new Date();
        const voucherExpiry = today.setDate(today.getDate() + voucherValidTillDays);
        let user;
        user = new UserModel({
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            country,
            phoneNumber,
            profilePicture: defaultProfilePicture,
            plan,
            isLoggedIn: true,
            paymentMethod,
            voucherExpiryDate: voucherExpiry,
            BdoId
        });

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        await VoucherModel.updateOne({ code: voucher }, {
            user: user._id,
            isActive: true,
            expiry: voucherExpiry
        });


        // payload
        const payload = { userId: user._id };
        jwt.sign(payload, process.env.jwtSecret, { expiresIn: '365d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}

exports.checkSignupDetails = async (req, res) => {
    const { email, password } = req.body.user;
    if (!isEmail(email)) return res.status(401).send('Invalid Email');
    if (password.length < 4) return res.status(401).send('Password must be atleast 6 characters');
    try {

        const userEmail = await UserModel.findOne({ email: email.toLowerCase() });
        if (userEmail) return res.status(401).send('User already registered');
        return res.status(200).send('Available');


    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.registerUserWithPayfast = async (req, res) => {
    const { name, email, username, password, phoneNumber, country, plan, paymentMethod, planPrice,BdoId } = req.body.user;
    const { err_code, transaction_id } = req.body.payFastResponse;

    try {
        let user;
        const today = new Date();
        const nextPayment = today.setDate(today.getDate() + 30);

        user = new UserModel({
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            country,
            phoneNumber,
            profilePicture: defaultProfilePicture,
            plan,
            isLoggedIn: true,
            paymentMethod,
            ammount: planPrice,
            nextPaymentDate: nextPayment,
            transactionId: transaction_id,
            BdoId
        });
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        // payload
        const payload = { userId: user._id };
        jwt.sign(payload, process.env.jwtSecret, { expiresIn: '365d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}

exports.getPaymentDetails = (req, res) => {
    return res.status(200).send(req.body);
}

exports.registuerUserWithTrial = async (req, res) => {
    const { name, email, username, password, phoneNumber, country, plan, paymentMethod, planPrice,BdoId} = req.body.user;
    // trialExpiryDate
    const transaction_id = '0dda010f-4d17-a322-3xb3-178d08def5b9';
    try {
        let user;
        const today = new Date();
        const trialExpiry = today.setDate(today.getDate() + 3);

        user = new UserModel({
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            country,
            phoneNumber,
            profilePicture: defaultProfilePicture,
            plan,
            isLoggedIn: true,
            paymentMethod,
            ammount: planPrice,
            nextPaymentDate: trialExpiry,
            transactionId: transaction_id,
            BdoId
        });
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        // payload
        const payload = { userId: user._id };
        jwt.sign(payload, process.env.jwtSecret, { expiresIn: '365d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}
exports.getUserBdo = async(req,res)=>{
    const BdoId = req.body;
    try {
        const users = await UserModel.findOne(BdoId).sort({ createdAt: -1 });
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}
