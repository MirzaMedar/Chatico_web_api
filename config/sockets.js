const { ON_PRIVATE_MESSAGE_RECEIVED, ON_PRIVATE_MESSAGE_SENT } = require('../constants/events');
const Message = require('../models/message');

var connectedUsersPool = [];

function startListening(io) {
    io.on('connection', function (socket) {
        const userId = socket.handshake.query.userId;
        console.log("USERID: " + userId);

        console.log("CONNECTED USER ID EVENT");

        var alreadyExisting = !!connectedUsersPool.find((item) => item.userId === userId);

        if (!alreadyExisting)
            connectedUsersPool.push({
                userId: userId,
                userSocketId: socket.id
            });
        console.log(connectedUsersPool);


        socket.on('connectedUserId', function (data) {
            console.log("CONNECTED USER ID EVENT");
            console.log(data);

            var alreadyExisting = !!connectedUsersPool.find((item) => item.userId === data.userId);

            if (!alreadyExisting)
                connectedUsersPool.push({
                    userId: data.userId,
                    userSocketId: socket.id
                });
            console.log(connectedUsersPool);
        });

        socket.on(ON_PRIVATE_MESSAGE_SENT, async (data) => {
            console.log(data);
            var parsedData = data;
            console.log("MESSAGE");
            console.log(parsedData);

            await Message.create({
                senderId: parsedData.senderId,
                receiverId: parsedData.receiverId,
                message: parsedData.message
            }, (error, small) => {
                if (!error)
                    console.log("Message added");
            });

            // var receiverConnected = !!Object.keys(io.sockets.sockets).find((item) => item == parsedData.receiverSocketId);
            var receiver = connectedUsersPool.find((item) => item.userId == parsedData.receiverId);

            if (!!receiver)
                io.to(receiver.userSocketId).emit(ON_PRIVATE_MESSAGE_RECEIVED, parsedData.message);

        });

        socket.on('disconnect', function () {
            console.log("disconnected");
            console.log(socket.id);

            // remove user from pool on disconnect event
            var connection = connectedUsersPool.find((item) => item.userSocketId == socket.id);
            var indexToDelete = connectedUsersPool.indexOf(connection);
            connectedUsersPool.splice(indexToDelete, 1);

        });

        socket.on('error', function (err) {
            console.log(err);
        });
    });
};

module.exports = {
    startListening: startListening,
    connectedUsersPool: connectedUsersPool
}