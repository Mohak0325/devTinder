const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const {userAuth} = require('../middleware/auth');
const {validateEditProfileData} = require('../utils/validateData');

const profileRouter = express.Router();

profileRouter.get('/view' , userAuth , async (req , res) => {
    try {
        const user = req.user;
        if (!user) {
           return res.status(404).json({ message: 'User not found' });
       }
       res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Unauthorized" });
    }
});

profileRouter.patch('/edit' , userAuth , async (req , res) => {
    try {
       if(!validateEditProfileData(req)) {
        throw new Error('Invalid Data');
       }
       //This comes from userAuth middleware
       const loggedInUser = req.user;

       Object.keys(req.body).forEach((key) => {
           loggedInUser[key] = req.body[key];
       });

       await loggedInUser.save();
       res.status(200).json({
              message: `${loggedInUser.firstName} , your profile Updated Successfully`,
              success: true,
              user: loggedInUser
       })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

profileRouter.patch('/changePassword' , userAuth , async (req , res) => {
    try {
        const {newPassword} = req.body;
        const loggedInUser = req.user;

        const isStrongPassword = validator.isStrongPassword(newPassword);

        if(!isStrongPassword){
            throw new Error('Password is not strong enough');
        }
        else {
            const hashedPassword = await bcrypt.hash(newPassword , 8);

            loggedInUser.password = hashedPassword;
            await loggedInUser.save();
            res.send('Password Changed Successfully');
            res.status(200).json({
              message: `Password Changed Successfully`,
              success: true,
           })
        }

    } catch (error) {
        return res.status(500).json({ message: "Password is not changed" });
    }
});

module.exports = profileRouter;