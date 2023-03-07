const jwt = require('jsonwebtoken'); // Json web token
const bcrypt = require('bcryptjs');// For Encrypting password
const isEmail = require('validator/lib/isEmail');// For Email validation test
const UserModel = require('../model/UserModel');
const VoucherModel = require('../model/VoucherModel');
const MovieModel = require('../model/MovieModel');
const AdModel = require('../model/AdModel');
const FundingModel = require('../model/FundingModel');
const GiveawayModel = require('../model/GiveawayModel');
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;



exports.getAuth = async (req, res) => {
    const { userId } = req;
    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.sendStatus(404);
        if (user.role === 'complain responder' || user.role === 'request responder') return res.status(401).send('Unauthorized');
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getAdminAuth = async (req, res) => {
    const { userId } = req;

    try {
        const user = await UserModel.findById(userId);
        if (user.role === 'user') return res.status(401).send('Unauthorized');
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.loginUser = async (req, res) => {
    const { username, password } = req.body.user;
    try {
        const user = await UserModel.findOne({ username: username.toLowerCase() }).select('+password');
        if (!user) return res.status(401).send('Invalid Credentials');
        if (user.role === 'complain responder' || user.role === 'request responder') return res.status(401).send('Unauthorized');
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(401).send('Sorry, incorrect password');
        // if (user.isLoggedIn) return res.status(401).send('Account already logged in.');
        if (user.isLoggedIn) {
            user.isLoggedIn = false;
        }
        user.isLoggedIn = true;
        await user.save();
        // payload
        const payload = { userId: user._id };
        jwt.sign(payload, process.env.jwtSecret, { expiresIn: "365d" }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.logoutUser = async (req, res) => {
    const { _id } = req.body;
    try {
        const user = await UserModel.findById(_id);
        if (!user) return res.status(404).send('No User Found');
        user.isLoggedIn = false;
        await user.save();
        return res.status(200).send('Logout Successfull!');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.adminLogin = async (req, res) => {
    const { username, password } = req.body.user;
    try {
        const user = await UserModel.findOne({ username: username.toLowerCase() }).select('+password');
        if (!user) return res.status(401).send('Invalid Credentials');
        if (user.role === 'user') return res.sendStatus(404);
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(401).send('Sorry, incorrect password!');

        const payload = { userId: user._id };
        jwt.sign(payload, process.env.jwtSecret, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}



exports.renewVoucherAccount = async (req, res) => {
    const { _id } = req.body.user;
    const { voucher } = req.body;
    try {
        const voucherCode = await VoucherModel.findOne({ code: voucher });
        if (!voucherCode) return res.status(401).send('Invalid Voucher Code. Please Try Again');
        if (voucherCode.isActive) return res.status(404).send('Unauthorized');
        const voucherValidTillDays = voucherCode.validtill;
        const today = new Date();
        const voucherExpiry = today.setDate(today.getDate() + voucherValidTillDays);

        await UserModel.findByIdAndUpdate({ _id }, {
            voucherExpiryDate: voucherExpiry,
            paymentMethod: 'voucher'
        });
        await VoucherModel.updateOne({ code: voucher }, {
            user: _id,
            isActive: true,
            expiry: voucherExpiry
        });

        res.status(200).send('Successfully Renewed Account');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }

}

exports.upgradePlan = async (req, res) => {
    console.log(req.body.user);
    const { _id, selectedPlan, planPrice } = req.body.user;
    try {
        await UserModel.findByIdAndUpdate({ _id }, {
            plan: selectedPlan,
            ammount: planPrice
        });
        res.status(200).send('Successfully Upgraded Plan!');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.renewCardAccount = async (req, res) => {
    const { _id } = req.body.user;
    const { err_code, transaction_id } = req.body.payFastResponse;
    try {
        if (err_code === '00' || err_code === '000') {
            const today = new Date();
            const nextPayment = today.setDate(today.getDate() + 30);
            await UserModel.findOneAndUpdate({ _id }, {
                nextPaymentDate: nextPayment,
                transactionId: transaction_id,
                paymentMethod: 'card'
            });
            res.status(200).send('Successfully Paid Subscription Fees!')
        } else {
            return res.status(402).send('Payment Required Please Try Again!');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}



exports.getUserStats = async (req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1);
    try {
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

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}



exports.getUserByCity = async (req, res) => {
    const today = new Date();
    try {
        const data = await UserModel.aggregate([
            { $match: { 'role': 'user' } },
            {
                $group: {
                    _id: "$country",
                    totalUsers: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}






exports.getNewUsers = async (req, res) => {
    try {
        const newUsers = await UserModel.find({ role: 'user' }).limit(5).sort({ createdAt: -1 });
        res.status(200).json(newUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}





exports.getAllStatsForDashboard = async (req, res) => {
    try {
        const movies = await MovieModel.find();
        const ad = await AdModel.find();
        const goldVouchers = await VoucherModel.find({ type: 'Gold' });
        const standardVouchers = await VoucherModel.find({ type: 'Standard' });
        const giveaways = await GiveawayModel.find();
        const fundings = await FundingModel.find();
        const complainResponder = await UserModel.find({ role: 'complain responder' });
        const requestResponder = await UserModel.find({ role: 'request responder' });
        const paymentMethodVoucher = await UserModel.find({ paymentMethod: 'voucher' });
        const paymentMethodCard = await UserModel.find({ paymentMethod: 'card' });
        res.status(200).json({
            movies: movies.length,
            ad: ad.length,
            goldVouchers: goldVouchers.length,
            standardVouchers: standardVouchers.length,
            giveaways: giveaways.length,
            fundings: fundings.length,
            complainResponder: complainResponder.length,
            requestResponder: requestResponder.length,
            paymentMethodVoucher: paymentMethodVoucher.length,
            paymentMethodCard: paymentMethodCard.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


exports.changePassword = async (req, res, next) => {
    try {
        const { userId } = req;
        const { currentPassword, newPassword } = req.body;
        if (newPassword.length < 5) {
            return res.status(401).send('Password must be atleast 5 characters');
        }
        const user = await UserModel.findById(userId).select('+password');
        const isPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isPassword) {
            return res.status(401).send('Invalid Password');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.save();
        return res.status(200).send('Password Changed Successfully!');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}

exports.changeUsername = async (req, res, next) => {
    const { userId } = req;
    const { username } = req.body;
    try {
        if (username.length < 1) return res.status(401).send('Invalid');
        if (!regexUserName.test(username)) return res.status(401).send('Test Failed');
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).send('Not found');
        user.username = username;
        user.save();
        return res.status(200).send('Username Changed Successfully!');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}