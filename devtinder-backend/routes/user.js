const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();
const USER_SAFE_DATA = 'firstName lastName age skills gender photoURL about';

userRouter.get('/requests/received' , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
    }).populate('fromUserId' , USER_SAFE_DATA);

    res.status(200).json({ 
        success: true,
        message: 'Here are your connection requests.',
        data: connectionRequest,
    });
    }
    catch(error){
        res.status(400).json({
            success: false,
            message: 'Error:' + error.message,
        });
    }
});

userRouter.get('/connections' , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId' , USER_SAFE_DATA).populate('toUserId' , USER_SAFE_DATA);

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.status(200).json({
            message: 'connection fetched successfully',
            success: true,
            data,
        });
    }
    catch(error){
        res.status(400).json({
            success: false,
            message: 'Error:' + error.message,
        });
    }
});

userRouter.get('/feed' , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 100);
        limit = Math.max(limit, 1); 
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionRequest.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUserFromFeed) } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);



        res.json({
            message: 'Data fetched successfully',
            success: true,
            data: users,
        });
    }
    catch(error){
        res.status(400).json({
            success: false,
            message: 'Error:' + error.message,
        });
    }
});

module.exports = userRouter;