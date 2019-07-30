const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.postRegister = (req, res, next) => {
  const { email, password, retypepassword } = req.body;

  let token;

  if (email && password == retypepassword) {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    return bcrypt
      .hash(password, saltRounds)
      .then(hashedPassword => {
        const user = new User({ email: email, password: hashedPassword });

        user
          .save()
          .then(() => {
            token = jwt.sign(
              {
                data: { email }
              },
              'secret',
              { expiresIn: '1h' }
            );

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

  let token;

  if (email && password) {
    token = jwt.sign(
      {
        data: { email }
      },
      'secret',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      data: {
        email: email
      },
      token: token
    });
  }

  res.status(403).json({ message: 'Invalid login.' });
};

exports.postCheck = (req, res, next) => {
  res.status(200).json({ valid: 'true' });
};

exports.getDestroy = (req, res, next) => {
  let { token } = req.headers;

  token = null;
  res.status(200).json({ logout: true });
};
