const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const decoded = jwt.verify(req.body.token, 'secret');

  if (decoded) next();
  else res.status(401).json({ message: 'Invalid token' });
};

module.exports = { checkAuth };
