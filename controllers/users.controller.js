const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.uploadImage = async (req, res) => {
    const userId = getUserIdFromToken(req.headers['token']);

    try {
        const user = await User.findOne({ _id: userId });

        var datePrefix = Date.now();
        const path = 'public/images/' + datePrefix + '.png';

        //change url when app gets deployed to production environment
        user.imageUrl = `https://e0b0550d.ngrok.io/images/${datePrefix}.png`;

        const imgdata = req.body.base64Image;
        const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');

        fs.writeFileSync(path, base64Data, { encoding: 'base64' });
        await user.save();
    } catch (e) {
        return res.status(500).json({
            message: 'An error occured while uploading your image!'
        });
    }

    res.status(200).json({
        message: 'Image uploaded successfully'
    });
}

module.exports.getUserById = async (req, res) => {
    const userId = getUserIdFromToken(req.headers['token']);
    try {
        const user = await User.findOne({ _id: userId });
        const userData = {
            id: user._id,
            imageUrl: user.imageUrl,
            name: user.name,
            email: user.email,
            username: user.username
        };
        return res.status(200).json({ userData });

    } catch (e) {
        return res.status(500).json({
            message: 'An error occured while trying to get user data!',
            error: e
        });
    }
}

module.exports.setPlayerId = async (req, res) => {
    const userId = getUserIdFromToken(req.headers['token']);
    const playerId = req.headers['playerid'];

    try {
        const user = await User.findOne({ _id: userId });
        user.playerId = playerId;

        await user.save();

        const userData = {
            id: user._id,
            imageUrl: user.imageUrl,
            name: user.name,
            email: user.email,
            username: user.username,
            playerId: playerId
        };

        return res.status(200).json({
            message: 'Success',
            userData
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'An error occured while trying to get user data!',
            error: e
        });
    }
}

getUserIdFromToken = (token) => {
    var token = jwt.decode(token);
    return token && token.user._id;
};
