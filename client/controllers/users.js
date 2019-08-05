exports.getLogin = (req, res, next) => {
  res.render('adminpanel/login', { title: 'Login' });
};

exports.getRegister = (req, res, next) => {
  res.render('adminpanel/register', { title: 'Register' });
};
