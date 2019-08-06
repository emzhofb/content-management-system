exports.getIndex = (req, res, next) => {
  res.render('index', { title: 'Dashboard' });
};

exports.getHome = (req, res, next) => {
  res.render('home/index', { title: 'Home' });
};
