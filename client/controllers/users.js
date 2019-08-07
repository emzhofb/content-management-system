const passport = require('passport');

exports.getLogin = (req, res, next) => {
  res.render('adminpanel/login', { title: 'Login' });
};

exports.getRegister = (req, res, next) => {
  res.render('adminpanel/register', { title: 'Register' });
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
  req.session.destroy(err => {
    if (err) console.log(err);

    res.redirect('/');
  });
};

exports.getAuthTwitter = passport.authenticate('twitter');

exports.getAuthTwitterCallback = passport.authenticate('twitter', {
  successRedirect: '/home',
  failureRedirect: '/login'
});

exports.getAuthGoogle = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.getAuthGoogleCallback = passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/'
});
