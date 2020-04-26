var express = require('express');
var router = express.Router();
const { uploadImage, getUserById } = require('./../controllers/users.controller');

/* GET users listing. */
router.post('/uploadImage', uploadImage);

router.get('/getUserById', getUserById);

module.exports = router;
