const express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('template', 
    { 
        locals:{
            title: 'Games'
        },
        partials: {
            partial:'partial-games'
        }
    });
});

router.get('/regular', function(req, res, next) {
    res.render('template', 
    { 
        locals:{
            title: 'Regular'
        },
        partials: {
            partial:'partial-games-regular'
        }
    });
});

module.exports = router;
