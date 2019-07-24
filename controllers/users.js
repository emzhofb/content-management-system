const jwt = require('jsonwebtoken');

exports.postRegister = (req, res, next) => {
  const { email, password, retypepassword } = req.body;
  
  let token;

  if (password == retypepassword) {
    token = jwt.sign({
      data: { email }
    }, 'secret', { expiresIn: '1h' });
  }

  res.send({
    data: {
      email: email
    },
    token: token
  });
};
