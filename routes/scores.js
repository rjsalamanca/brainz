const express = require('express'),
    router = express.Router(),
    scoresModel = require('../models/scores');

/* GET home page. */
router.get('/', async (req, res, next) => {
    const getScores = await scoresModel.getAllScores();
    const getUsers = await scoresModel.getUserId();
    
    res.render('template', { 
        locals: {
            title: 'Scores',
            scores: getScores,
            users: getUsers
        },
        partials: {
            partial:'partial-scores'
        }
    });
});

module.exports = router;
