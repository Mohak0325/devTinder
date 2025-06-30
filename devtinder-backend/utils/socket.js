const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');
const getSecretRoomtId = ({userId , targetUserId}) => {
    return crypto
           .createHash('sha256')
           .update([userId, targetUserId].sort().join('_'))
           .digest('hex');
}
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173',
        },
    });

    io.on('connection', (socket) => {
        //Handle events
        socket.on('joinChat' , ({firstName , userId , targetUserId}) => {
            const roomId = getSecretRoomtId({userId , targetUserId});
            console.log(firstName + " Joining Room :" + roomId);
            socket.join(roomId);
        });

        socket.on('sendMessage', async ({firstName , userId, targetUserId , text}) => {
            try{
                const roomId = getSecretRoomtId({userId , targetUserId});
                if(!text || !firstName || !userId || !targetUserId) {
                    throw new Error('Invalid message data');
                }
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })
                
                if(!chat) {
                    chat =  new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                };

                chat.messages.push({
                    senderId : userId,
                    text,
                });

                await chat.save();
                io.to(roomId).emit('messageReceived' , { firstName , text });

            }
            catch(err) {
                return res.Status(500).json({error: err.message});
            }
        });

        socket.on('disconnect', () => {});
    });
};

module.exports = initializeSocket;