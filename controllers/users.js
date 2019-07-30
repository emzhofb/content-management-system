const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.postRegister = (req, res, next) => {
  const { email, password, retypepassword } = req.body;

  let token;

  if (email && password == retypepassword) {
    const saltRounds = 10;

    return bcrypt
      .hash(password, saltRounds)
      .then(hashedPassword => {
        token = jwt.sign(
          {
            data: { email }
          },
          'secret',
          { expiresIn: '1h' }
        );

        const user = new User({
          email: email,
          password: hashedPassword,
          token: token
        });

        user
          .save()
          .then(() => {
            res.status(200).json({
              data: {
                email: email
              },
              token: token
            });
          })
          .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
              res.status(422).send({ message: 'User already exist!' });
            }
          });
      })
      .catch(err => console.log(err));
  }

  res.status(400).json({ message: 'Invalid register.' });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const error = e => {
    throw e;
  };

  User.findOne({ email: email })
    .then(user => {
      if (user) {
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
          'secret',
          { expiresIn: '1h' }
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

      return User.findOneAndUpdate({ email: email }, { token: token });
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

  User.findOneAndUpdate({ token: token }, { token: null })
    .then(() => {
      res.status(200).json({ logout: true });
    })
    .catch(err => console.log(err));
};
