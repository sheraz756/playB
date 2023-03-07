const VoucherModel = require('../model/VoucherModel');


exports.createVouchers = async (req, res, next) => {
    const codesToInsert = [];
    const { allCodes, parsedTime } = req.body.data;
    try {
        for (let i = 0; i < allCodes.length; i++) {
            const code = allCodes[i];
            const validtill = parsedTime;
            const data = { code, validtill };
            codesToInsert.push(data);
        }
        await VoucherModel.insertMany(codesToInsert);
        return res.status(200).send('Vouchers Created Successfully!')
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.createGoldVouchers = async (req, res, next) => {
    const codesToInsert = [];
    const { allCodes, parsedTime } = req.body.data;
    try {
        for (let i = 0; i < allCodes.length; i++) {
            const code = allCodes[i];
            const validtill = parsedTime;
            const type = 'Gold';
            const data = { code, validtill, type };
            codesToInsert.push(data);
        }
        await VoucherModel.insertMany(codesToInsert);
        return res.status(200).send('Vouchers Created Successfully!')
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.createCustomGoldVoucher = async (req, res, next) => {
    const { customCode, parsedTime } = req.body;
    try {
        const isPresent = await VoucherModel.findOne({ code: customCode });
        if (isPresent) return res.status(401).send('Code already exist!');
        let voucherCode;
        voucherCode = new VoucherModel({
            code: customCode,
            type: 'Gold',
            validtill: parsedTime
        });
        await voucherCode.save();
        return res.status(200).send('Voucher created successfully!');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getVouchers = async (req, res, next) => {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 30;
    try {
        let voucher;
         voucher = await VoucherModel.find({ type: 'Standard' }).sort({ isActive: -1 }).populate('user');
         if (number === 1) {
            voucher = await VoucherModel.find({ type: 'Standard' })
                .limit(size)
                .sort({ isActive: 1 })
                .populate('user');

        } else {
            const skips = size * (number - 1);
            voucher = await VoucherModel.find({ type: 'Standard' })
                .skip(skips)
                .limit(size)
                .sort({ isActive: 1 })
                .populate('user');
        }
        return res.status(200).json(voucher);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getVouchersForExcel = async (req, res, next) => {
    try {
        const voucher = await VoucherModel.find({ type: 'Standard' })
        .sort({ isActive: 1 }).populate('user');
        return res.status(200).json(voucher);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getGoldVouchersForExcel = async (req, res, next) => {
    try {
        const voucher = await VoucherModel.find({ type: 'Gold' })
        .sort({ isActive: 1 }).populate('user');
        return res.status(200).json(voucher);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getGoldVouchers = async (req, res, next) => {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 30;
    try {
        let voucher;
         voucher = await VoucherModel.find({ type: 'Gold' }).sort({ isActive: -1 }).populate('user');
         if (number === 1) {
            voucher = await VoucherModel.find({ type: 'Gold' })
                .limit(size)
                .sort({ isActive: 1 })
                .populate('user');

        } else {
            const skips = size * (number - 1);
            voucher = await VoucherModel.find({ type: 'Gold' })
                .skip(skips)
                .limit(size)
                .sort({ isActive: 1 })
                .populate('user');
        }
        return res.status(200).json(voucher);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.deleteVoucher = async (req, res, next) => {
    try {
        const { id } = req.params;
        const voucher = await VoucherModel.findById(id);
        if (!voucher) return res.status(401).send('Voucher not found!');
        await voucher.deleteOne();
        return res.status(200).send('Voucher deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}

exports.searchVouchers = async (req, res, next) => {
    const { searchText } = req.params;
    try {

        const voucher = await VoucherModel.find({
            code: { $regex: searchText, $options: 'i' }
        }).populate('user');
        res.status(200).json(voucher);

    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getVoucherById = async (req, res, next) => {
    const { id } = req.params;
    try {

        const voucher = await VoucherModel.findById(id).populate('user');;
        return res.status(200).json(voucher);

    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}
