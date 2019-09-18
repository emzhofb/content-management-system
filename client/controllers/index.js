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

exports.getDataDate = (req, res, next) => {
  const usertoken = req.session.passport.user.token;
  res.render('inside/datadate', {
    title: 'DataDate',
    token: usertoken,
    path: '/datadate'
  });
};

exports.getMap = (req, res, next) => {
  const usertoken = req.session.passport.user.token;
  res.render('inside/map', {
    title: 'Map',
    token: usertoken,
    path: '/map'
  });
};

exports.getBar = (req, res, next) => {
  res.render('dashboard/bar', { title: 'Bar' });
};

exports.getPie = (req, res, next) => {
  res.render('dashboard/pie', { title: 'Pie' });
};

exports.getLine = (req, res, next) => {
  res.render('dashboard/line', { title: 'Line' });
};

exports.getMaps = (req, res, next) => {
  res.render('dashboard/maps', { title: 'Maps' });
};
