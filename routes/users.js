var express = require('express');
var router = express.Router();

const userController = require('../controllers/users');

router.post('/register', userController.postRegister);
router.post('/login', userController.postLogin);
router.post('/check', userController.postCheck);
router.get('/destroy', userController.getDestroy);

module.exports = router;
