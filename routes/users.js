var express = require('express');
var router = express.Router();

const { checkAuth } = require('../middleware/auth');
const userController = require('../controllers/users');

router.post('/register', userController.postRegister);
router.post('/login', userController.postLogin);
router.post('/check', checkAuth, userController.postCheck);
router.get('/destroy', checkAuth, userController.getDestroy);

module.exports = router;
