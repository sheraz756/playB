const UserModel = require('../model/UserModel');
const defaultProfilePicture = 'https://playeon-assest.s3.ap-south-1.amazonaws.com/defaulticon.png';
const jwt = require('jsonwebtoken'); // Json web token
const bcrypt = require('bcryptjs');// For Encrypting password
const isEmail = require('validator/lib/isEmail');// For Email validation test

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find({ role: 'user' }).sort({ createdAt: -1 });
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getAllUsersWithNextPaymentDateEqualsToday = async (req, res, next) => {
    try {
        const users = await UserModel.find({ role: 'user', paymentMethod: 'card', nextPaymentDate: { $lt: new Date() } })
            .sort({ createdAt: -1 });

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).send('User not found!');
        const isAdmin = await UserModel.findById(userId);
        if (user !== isAdmin) {
            if (isAdmin.role === 'admin') {
                await user.deleteOne();
                return res.status(200).send('User deleted successfully');
            } else {
                return res.status(401).send('Not Authorized');
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}



exports.getOldAndNewUsers = async (rqe, res, next) => {

    const data = await UserModel.aggregate([
        { $match: { 'role': 'user' } },
        {
            $project: {
                month: { $month: "$createdAt" }
            }
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: 1 }
            }
        }
    ]);
    return res.status(200).json(data);
}


exports.createAdmin = async (req, res) => {
    const { name, email, username, password, phoneNumber, country } = req.body;
    console.log(req.body);
    try {
        let user;
        user = new UserModel({
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            country,
            phoneNumber,
            profilePicture: defaultProfilePicture,
            role: 'admin'
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


exports.getStats = async (req, res) => {
    const today = new Date();
    today.setDate(today.getMonth() - 1);
    try {
        const oldUsers = await UserModel.find({ role: 'user', createdAt: { $lt: today.toISOString() } });
        const newUsers = await UserModel.find({ role: 'user', createdAt: { $gt: today.toISOString() } });
        const data = [
            {
                "name": "Old Users",
                "Users": oldUsers.length
            },
            {
                "name": "New Users",
                "Users": newUsers.length
            }]
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.getUserByCategory = async (req, res) => {
    const { type } = req.params;
    let data = []
    try {
        if (type === 'all') {
            data = await UserModel.find({ role: 'user' }).sort({ createdAt: -1 });
        } else {
            data = await UserModel.find({ role: 'user', paymentMethod: type }).sort({ createdAt: -1 });
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.getUserByDates = async (req, res) => {
    const { startDate, endDate } = req.body.date;
    const { options } = req.body;
    let users = [];
    try {
        if (options === 'all') {
            users = await UserModel.find({
                role: 'user',
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ createdAt: -1 });
        } else {
            users = await UserModel.find({
                role: 'user',
                paymentMethod: options,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ createdAt: -1 });
        }

        // users = await UserModel.find({
        //     createdAt: {
        //         $gte: startDate,
        //         $lte: endDate
        //     }
        // }).sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.getUserByName = async (req, res) => {
    const { text } = req.params;

    try {
        const user = await UserModel.find({
            role: 'user',
            "$or": [
                {
                    "username": {
                        "$regex": text,
                        "$options": "i"
                    }
                },
                {
                    "email": {
                        "$regex": text,
                        "$options": "i"
                    }
                }
            ]
        }).sort({ createdAt: -1 });
        if (!user) return res.status(404).send('Not Found!');
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}