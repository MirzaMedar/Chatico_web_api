const { registerValidation, loginValidation } = require('../validators/validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    const { error } = registerValidation(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }


    var emailExists = await User.findOne({ email: req.body.email });
    var usernameExists = await User.findOne({ username: req.body.username });
    if (emailExists || usernameExists) {
        console.log('postoji email ili username');
        return res.status(400).json({ message: 'Email or username already exists!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({ user: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports.login = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ username: req.body.username });

    if (!user)
        return res.status(404).json({ message: 'User does not exist!' });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).json({ message: 'Invalid password!' });

    const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET);

    return res.status(200).json({ token: token, userId: user._id });
}

module.exports.verifyToken = async (req, res) => {
    var tokenParam = req.headers["token"];

    jwt.verify(tokenParam, process.env.
        TOKEN_SECRET, function (err, decoded) {
            if (err)
                return res.status(403).json({});

            return res.status(200).json({});
        });
}