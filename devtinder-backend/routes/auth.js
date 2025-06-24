const express = require('express');
const { validateSignupData } = require('../utils/validateData');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');


const authRouter = express.Router();

authRouter.post('/signup' , async (req , res) => {
    try {
        validateSignupData(req);

        const {firstName , lastName , email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password , 8);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save();
        if(!savedUser) {
            throw new Error('User not created');
        }
        
        const token = await user.getJWT();
        res.cookie('token' , token , {httpOnly: true  , secure: true, sameSite: 'None' , expires : new Date(Date.now() + 8 * 3600000)});

        res.status(201).json({ message: 'User registered successfully' , success:true , token: token , user: savedUser});  

    } catch(error) {
        return res.status(400).json({ message: error.message });
    }
});

authRouter.post('/login' , async (req , res) => {
    try{
        const {email , password} = req.body;

        if(!validator.isEmail(email)){
            throw new Error('Email is invalid');
        }

        const user = await User.findOne({
            email
        });

        if(!user) {
            throw new Error('Invalid Credentials');
        }

        const isPassword = await user.validatePassword(password);

        if(!isPassword){
            throw new Error('Invalid Credentials');
        }
        else{
            const token = await user.getJWT();
            res.cookie('token' , token , {httpOnly: true  , secure: true, sameSite: 'None' , expires : new Date(Date.now() + 8 * 3600000)});

            res.status(201).json({ message: 'Login successfully' , success:true , token: token , user: user});  
        }
    }
    catch(error){
        res.status(400).send("Error:" + error.message);
    }
});

authRouter.post('/logout', async (req, res) => {
  try {
    // Clear the auth token cookie
    res.clearCookie('token', {
      secure: true,
    });

    res.status(200).json({
      message: 'Logged out successfully',
      success: true,
    });
  } catch (error) {
        return res.status(500).json({ message: 'Logout failed' });
    }
});


module.exports = authRouter;