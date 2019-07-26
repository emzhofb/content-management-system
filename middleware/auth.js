const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
  const decoded = jwt.verify(req.headers.token, 'secret');

  if (decoded) next();
  else res.status(401).json({ message: 'Invalid token' });
};
