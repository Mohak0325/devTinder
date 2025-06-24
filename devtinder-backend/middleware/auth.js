const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

const userAuth = async (req , res , next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).send( 'Please Login First' );
        }
        const data = jwt.verify(token , process.env.JWT_SECRET);
        
        const { _id } = data;

        const user =await User.findById(_id);
        if(!user){
            throw new Error('User not found');
        }
        else{
            req.user = user;
            next();
        }

    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = {userAuth}; 
