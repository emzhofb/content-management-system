const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.postRegister = (req, res, next) => {
  const { email, password, retypepassword } = req.body;

  if (email && password == retypepassword) {
    return bcrypt
      .hash(password, 10)
      .then(hashedPassword => {
        if (hashedPassword) {
          const user = new User({
            local: {
              email: email,
              password: hashedPassword,
              token: null
            }
          });

          return user.save();
        }
      })
      .then(user => {
        if (user) {
          return jwt.sign(
            {
              data: { email }
            },
            'secret'
          );
        }
      })
      .then(token => {
        if (token) {
          res.status(200).json({
            data: {
              email: email
            },
            token: token
          });

          return User.findOneAndUpdate(
            { 'local.email': email },
            { 'local.token': token }
          );
        }
      })
      .catch(err => {
        if (err.name === 'MongoError' && err.code === 11000) {
          return res.status(422).send({ message: 'User already exist!' });
        }

        res.status(400).json({ message: 'Invalid register.' });
      });
  }

  res.status(400).json({ message: 'Invalid register.' });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const error = e => {
    throw e;
  };

  User.findOne({ 'local.email': email })
    .then(user => {
      if (user) {
        user = user.local;
        return user.password;
      }

      error('User not found!');
    })
    .then(userpassword => {
      return bcrypt.compare(password, userpassword);
    })
    .then(response => {
      if (response) {
        return jwt.sign(
          {
            data: { email }
          },
          'secret'
        );
      }

      error('Wrong password!');
    })
    .then(token => {
      res.status(200).json({
        data: {
          email: email
        },
        token: token
      });

      return User.findOneAndUpdate(
        { 'local.email': email },
        { 'local.token': token }
      );
    })
    .catch(err => {
      res.status(403).json({ message: err });
    });
};

exports.postCheck = (req, res, next) => {
  res.status(200).json({ valid: 'true' });
};

exports.getDestroy = (req, res, next) => {
  let { token } = req.headers;

  User.findOneAndUpdate({ 'local.token': token }, { 'local.token': null })
    .then(() => {
      res.status(200).json({ logout: true });
    })
    .catch(err => console.log(err));
};

// exports.postTwitter = (req, res, next) => {
//   const { request, token, tokenSecret, profile } = req.query;

//   console.log('twitter');
//   console.log(request);
//   console.log(token);
//   console.log(tokenSecret);
//   console.log(profile);
// };

// exports.postGoogle = (req, res, next) => {
//   const { token, profile } = req.body;

//   const user = new User({
//     google: {
//       id: profile.id,
//       token: token,
//       name: profile.displayName,
//       email: profile.emails[0].value
//     }
//   });

//   user
//     .save()
//     .then(result => {
//       res.status(200).json({
//         data: {
//           email: result.google.email
//         },
//         token: result.google.token
//       });
//     })
//     .catch(err => {
//       res.status(403).json({ message: err });
//     });
// };
