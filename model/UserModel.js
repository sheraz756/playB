const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true, select: false },
    username: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true },
    country: { type: String, required: true },
    plan: { type: String },
    ammount: { type: Number },
    paymentMethod: { type: String, enum: ['voucher', 'card'] },
    role: { type: String, default: "user", enum: ['user', 'admin', 'complain responder', 'request responder'] },
    profilePicture: { type: String },
    nextPaymentDate: { type: Date },
    transactionId: { type: String },
    voucherExpiryDate: { type: Date },
    isLoggedIn: { type: Boolean, default: false },
    resetToken: { type: String },
    expireToken: { type: Date },
    last_login_IP: { type: String },
    BdoId:{type:String}
}, { timestamps: true });


module.exports = model('User', UserSchema);