const IdSchema = require('../model/IdModel')
const bcrypt = require('bcryptjs');
exports.liveStreamer = async (req, res) => {
    const { name, email, username, password, phoneNumber, country, plan, paymentMethod ,userId,imgPic } = req.body;
    try {

        let user;
        user = new IdSchema({
            name,
            email,
            username,
            password,
            country,
            phoneNumber,
            // profilePicture: defaultProfilePicture,
            plan,
            // isLoggedIn: true,
            paymentMethod,
            userId,
            imgPic

            // voucherExpiryDate: voucherExpiry,
        });
        // user.password = await bcrypt.hash(password, 10);
        await user.save();
        return res.status(200).send("id send to db")



 


    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}
exports.deleteUserId = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const movie = await IdSchema.findOne(userId);
        if (!movie) return res.status(401).send('movie not found!');
        await movie.deleteOne();
        return res.status(200).send('movie deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}
exports.getUserList = async (req,res,next)=>{
    try{
        const movie = await IdSchema.find()
        return res.status(200).send(movie)
    }
    catch(e){
        console.log(e)
        return res.status(500).send("internal server error")
    }
}