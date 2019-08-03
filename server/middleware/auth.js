const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const { token } = req.headers;

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token.' });

    next();
  });
};

module.exports = { checkAuth };
