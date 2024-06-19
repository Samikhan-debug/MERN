module.exports = function(req, res, next) {
    if (!req.session.user) res.redirect('/login');
    else next();
  };
  
  // Use this middleware in your app.js for protected routes
  app.get('/', checkAuth, (req, res) => {
    res.render('homepage');
  });