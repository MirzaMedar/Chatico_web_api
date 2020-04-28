var express = require('express');
var router = express.Router();
const { uploadImage, getUserById, setPlayerId } = require('./../controllers/users.controller');

/* GET users listing. */
router.post('/uploadImage', uploadImage);

router.get('/getUserById', getUserById);

router.get('/setPlayerId', setPlayerId);

module.exports = router;
