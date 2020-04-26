var express = require('express');
var router = express.Router();
const { register, login, verifyToken } = require('../controllers/auth.controller');


router.post('/register', register);

router.post('/login', login);

router.get('/verifyToken', verifyToken);

module.exports = router;