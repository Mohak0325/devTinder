const express = require('express');
const { userAuth } = require('../middleware/auth');
const Chat = require('../models/chat');

const chatRouter = express.Router();

chatRouter.get('/:targetUserId' , userAuth , async (req, res) => {
    try{
        const { targetUserId } = req.params;
        const userId = req.user._id;

        if(!targetUserId) {
            return res.status(400).json({ success: false, message: 'Target user ID is required' });
        }
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
            }).populate({
            path: "messages.senderId" ,
            select: "firstName"
        });

        if(!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
        }
        res.status(200).json({ success: true, chat });

    }
    catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = chatRouter;