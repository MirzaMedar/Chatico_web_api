const User = require('../models/user');
const Message = require('../models/message');
const { connectedUsersPool } = require('../config/sockets');
const jwt = require('jsonwebtoken');

module.exports.getUsers = async (req, res) => {
    console.log("build pool users");
    console.log(connectedUsersPool);
    try {
        var users = await User.find({});

        for (var i = 0; i < users.length; i++) {
            console.log(users[i]._id);
            var connection = connectedUsersPool.find((item) => item.userId.toString() === users[i]._id.toString());

            if (connection)
                users[i].socketId = connection.userSocketId;
        }

        return res.status(200).json({ users });

    } catch (e) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

module.exports.getOnlineUsers = async (req, res) => {
    var responseArray = [];
    try {
        var users = await User.find({});

        for (var i = 0; i < users.length; i++) {
            var connection = connectedUsersPool.find((item) => item.userId.toString() === users[i]._id.toString());

            if (connection) {
                users[i].socketId = connection.userSocketId;
                responseArray.push(users[i]);
            }
        }

        return res.status(200).json({ responseArray });

    } catch (e) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

module.exports.getRecentChats = async (req, res) => {
    var userId = req.params["userId"];
    var messagesFromDb = [];
    var recentChats = [];

    Message.find({ $or: [{ 'senderId': userId }, { 'receiverId': userId }] },
        async function (err, docs) {
            if (!err) {
                messagesFromDb = [...docs];

                for (var i = 0; i < messagesFromDb.length; i++) {
                    var currentItem = messagesFromDb[i];
                    var existing = recentChats.find((item) => item.id == messagesFromDb[i].senderId || item.id == messagesFromDb[i].receiverId);

                    if (!(!!existing)) {
                        var receiver = currentItem.senderId != userId ?
                            (await User.findOne({ '_id': currentItem.senderId })) :
                            (await User.findOne({ '_id': currentItem.receiverId }));

                        var receiverConnection = connectedUsersPool.find((item) => item.userId === receiver._id);

                        recentChats.push({
                            id: currentItem.senderId != userId ? currentItem.senderId : currentItem.receiverId,
                            name: receiver.name,
                            imageUrl: receiver.imageUrl != "" ? receiver.imageUrl : null,
                            lastMessage: currentItem.message,
                            socketId: !!receiverConnection ? receiverConnection.userSocketId : null,
                            date: currentItem.date
                        });
                    }

                    else {
                        var dateOfCurrent = new Date(currentItem.date);
                        var dateOfExisting = new Date(existing.date);

                        if (dateOfCurrent > dateOfExisting) {
                            existing.lastMessage = messagesFromDb[i].message;
                            existing.date = messagesFromDb[i].date;
                        }
                    }
                }
            }
            else
                return res.status(500).json({ message: 'Internal server error!' });

            return res.status(200).json({ recentChats });

        });
}



module.exports.getChatMessages = async (req, res) => {
    var token = req.headers["token"];
    var userId = req.params["userId"];
    var loggedUserId = getUserIdFromToken(token);
    var messages = [];

    console.log(loggedUserId);
    console.log(userId);


    Message.find({
        $or: [{ $and: [{ 'senderId': loggedUserId }, { 'receiverId': userId }] },
        { $and: [{ 'senderId': userId }, { 'receiverId': loggedUserId }] }]
    },
        function (err, docs) {
            if (!err) {
                messages = [...docs];
                return res.status(200).json({ messages });

            }
            else
                return res.status(500).json({ message: 'Internal server error!' });
        });

}

getUserIdFromToken = (token) => {
    var token = jwt.decode(token);
    return token && token.user._id;
};

/*

$2a$10$S0O4s9xFnK1bpp2xTI5dZui3w6u38gfC8aMlcMBq.RqHf5BcqxK5O
2020-04-03T21:19:23.641+00:00
*/