const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const VoucherModel = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    code: { type: String, required: true },
    type: { type: String, default: 'Standard', enum: ['Standard', 'Gold'] },
    validtill: { type: Number, required: true },
    expiry: { type: Date },
    isActive: { type: Boolean, default: false }
},
    { timestamps: true });

module.exports = model('Voucher', VoucherModel);