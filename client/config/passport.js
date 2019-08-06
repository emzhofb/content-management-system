const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-register',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        axios
          .post('http://localhost:4000/api/users/register', {
            email: email,
            password: password,
            retypepassword: req.body.retypepassword
          })
          .then(res => {
            if (res.data.data.email) {
              return done(null, res.data);
            }
          })
          .catch(err => done(err));
      }
    )
  );

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        axios
          .post('http://localhost:4000/api/users/login', {
            email: email,
            password: password
          })
          .then(res => {
            if (res.data.data.email) {
              return done(null, res.data);
            }
          })
          .catch(err => done(err));
      }
    )
  );
};
