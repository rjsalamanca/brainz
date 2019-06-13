const express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template', { 
    locals:{
      isLoggedIn: req.session.loggedIn,
      title: 'Home Page'
    },
    partials: {
      partial:'partial-index'
    }
  });
});

module.exports = router;