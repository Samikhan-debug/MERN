app.use((req, res, next) => {
    res.locals.user = req.session.user; // Make user object globally available in all views
    next();
});