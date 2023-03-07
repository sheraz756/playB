const Bdomodel = require('../model/BdoModel')
const bcrypt = require('bcryptjs');
exports.createBdo = async (req, res) => {
    const { name, email, username, password, phoneNumber,BdoId,imgPic } = req.body;
    try {

        let user;
        user = new Bdomodel({
            name,
            email,
            username,
            password,
            phoneNumber,
            BdoId,
            imgPic

            // voucherExpiryDate: voucherExpiry,
        });
        // user.password = await bcrypt.hash(password, 10);
        await user.save();
        return res.status(200).send("Sales Staff Created")



 


    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}
exports.deleteBdo = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const movie = await Bdomodel.findOne(userId);
        if (!movie) return res.status(401).send('Staff not found!');
        await movie.deleteOne();
        return res.status(200).send('Staff Remove');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}
exports.getBdoList = async (req,res,next)=>{
    try{
        const movie = await IdSchema.find()
        return res.status(200).send(movie)
    }
    catch(e){
        console.log(e)
        return res.status(500).send("internal server error")
    }
}