const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/users');

/* GET home page. */
router.get('/login', userController.getLogin);
router.get('/register', userController.getRegister);
router.post(
  '/register',
  passport.authenticate('local-register', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
);

module.exports = router;
