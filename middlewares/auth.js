const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        var tokenParam = req.headers["token"];

        jwt.verify(tokenParam, process.env.
            TOKEN_SECRET, function (err, decoded) {
                if (err)
                    throw 'Token expired';

                next();
            });
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};