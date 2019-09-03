const passport = require('passport');
const axios = require('axios');

exports.getLogin = (req, res, next) => {
  res.render('adminpanel/login', { title: 'Login' });
};

exports.getRegister = (req, res, next) => {
  let message = req.flash('register');

  res.render('adminpanel/register', {
    title: 'Register',
    messages: message
  });
};

exports.postLogin = passport.authenticate('local-login', {
  successRedirect: '/home', // redirect to the secure profile section
  failureRedirect: '/login', // redirect back to the login page if there is an error
  failureFlash: true // allow flash messages
});

exports.postRegister = passport.authenticate('local-register', {
  successRedirect: '/home', // redirect to the secure profile section
  failureRedirect: '/register', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
});

exports.getLogout = (req, res, next) => {
  axios
    .get('http://localhost:4000/api/users/destroy', {
      headers: {
        token: req.session.passport.user.token
      }
    })
    .then(response => {
      if (response.data.logout == true) {
        res.redirect('/');
      }
    })
    .catch(err => console.log(err));
};

exports.getAuthTwitter = passport.authenticate('twitter', { scope: 'email' });

exports.getAuthTwitterCallback = passport.authenticate('twitter', {
  successRedirect: '/home',
  failureRedirect: '/login'
});

exports.getAuthGoogle = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.getAuthGoogleCallback = passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/login'
});
