const express = require('express');
const {userAuth} = require('../middleware/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

const requestsRouter = express.Router();

requestsRouter.post('/send/:status/:toUserId' , userAuth , async (req , res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['interested', 'ignored'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status type:'+ status,
            });
        }

        if (fromUserId == toUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send request to yourself',
            });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Request already exists between these users',
            });
        }

        const request = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const message =status === "interested"
                        ? `${req.user.firstName} is interested in ${toUser.firstName}.`
                        : `${req.user.firstName} has ignored ${toUser.firstName}.`;

        const data = await request.save();
        res.json({
            success: true,
            message: message,
            data,
        })
    }
    catch(error){
        res.status(500).json( {
            success: false,
            message: 'Error occurred while sending request: ' + error.message,
        });
    }
});

requestsRouter.post('/review/:status/:requestId' , userAuth , async (req , res) => {
    try{
        const loggedInUserId = req.user._id;
        const requestId = req.params.requestId;
        const status = req.params.status;

        const allowedStatus = ['accepted', 'rejected'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status type:'+ status,
            });
        }

        const request = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId,
            status: 'interested'
        });
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found',
            });
        }

        request.status = status;
        await request.save();

        res.json({
            success: true,
            message: "Request has been " + status + " by you",
            data: request,
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: 'Error occurred while reviewing request: ' + error.message,
        });
    }
});

module.exports = requestsRouter;