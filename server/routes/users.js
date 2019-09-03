const express = require('express');
const router = express.Router();

const { checkAuth } = require('../middleware/auth');
const userController = require('../controllers/users');

router.post('/register', userController.postRegister);
router.post('/login', userController.postLogin);
router.post('/check', checkAuth, userController.postCheck);
router.get('/destroy', checkAuth, userController.getDestroy);
// router.post('/auth/twitter', userController.postTwitter);
// router.post('/auth/google', userController.postGoogle);

module.exports = router;
