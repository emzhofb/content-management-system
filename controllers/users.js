const jwt = require('jsonwebtoken');
let token;

exports.postRegister = (req, res, next) => {
  const { email, password, retypepassword } = req.body;

  if (email && password == retypepassword) {
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
  } else {
    res.status(400).json({ message: 'Invalid register.' });
  }
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

    res.status(200).json({
      data: {
        email: email
      },
      token: token
    });
  } else {
    res.status(403).json({ message: 'Invalid login.' });
  }
};

exports.postCheck = (req, res, next) => {
  const { token } = req.body;

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token.' });

    res.status(200).json({ valid: 'true' });
  });
};

exports.getDestroy = (req, res, next) => {
  let { token } = req.body;
  token = null;

  res.status(200).json({ logout: true });
};
