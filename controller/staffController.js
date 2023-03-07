const UserModel = require('../model/UserModel');
const jwt = require('jsonwebtoken'); // Json web token
const bcrypt = require('bcryptjs');// For Encrypting password
const isEmail = require('validator/lib/isEmail');// For Email validation test
// Regex expression text for username
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const defaultStaffPicture = 'https://playeon-assest.s3.ap-south-1.amazonaws.com/defaulticon.png';

exports.getAllStaff = async (req, res, next) => {
    try {
        const staff = await UserModel.find({ role: ['complain responder', 'request responder'] }).sort({ createdAt: -1 });
        return res.status(200).json({ staff });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.registerStaff = async (req, res, next) => {
    const { name, email, role, password, phoneNumber, username } = req.body.staff;
    if (!isEmail(email)) return res.status(401).send('Invalid Email');
    if (password.length < 6) return res.status(401).send('Password must be atleast 6 characters');
    try {
        let staff;
        staff = await UserModel.findOne({ email: email.toLowerCase() });
        if (staff) return res.status(401).send('User already registered');
        staff = new UserModel({
            name,
            password,
            email: email.toLowerCase(),
            role: role.toLowerCase(),
            phoneNumber,
            profilePicture: defaultStaffPicture,
            country: 'Pakistan',
            username
        });
        staff.password = await bcrypt.hash(password, 10);
        await staff.save();

        // payload
        const payload = { userId: staff._id };
        jwt.sign(payload, process.env.jwtSecret, { expiresIn: '2d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.getStaffById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const staff = await UserModel.findById(id);
        if (!staff) return res.status(401).send('No Staff found');
        return res.status(200).json({ staff });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.updateStaffById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: req.body.staffData }, { new: true });
        updatedUser.save();
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }

}

exports.changeStaffPassword = async (req, res, next) => {
    const { userId } = req;
    const { password, staff } = req.body;
    try {
        const admin = await UserModel.findById(userId);
        if (!admin) return res.status(404).send('Not Found!');
        if (admin.role !== 'admin') return res.status(401).send('Unauthorized');
        const staffProfile = await UserModel.findById(staff).select('+password');
        if (!staffProfile) return res.status(404).send('Not found!');
        staffProfile.password = await bcrypt.hash(password, 10);
        staffProfile.save();
        return res.status(200).send('Password Changed Successfully!');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}