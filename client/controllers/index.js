exports.getIndex = (req, res, next) => {
  res.render('index', { title: 'Dashboard' });
};

exports.getHome = (req, res, next) => {
  const usermail = req.session.passport.user.data.email;
  res.render('inside/home', {
    title: 'Home',
    email: usermail,
    path: '/home'
  });
};

exports.getData = (req, res, next) => {
  const usertoken = req.session.passport.user.token;
  res.render('inside/data', {
    title: 'Data',
    token: usertoken,
    path: '/data'
  });
};
