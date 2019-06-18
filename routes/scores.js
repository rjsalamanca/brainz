const express = require('express'),
    router = express.Router(),
    scoresModel = require('../models/scores'),
    Kills = require('../models/killCount');

/* GET home page. */
router.get('/', async (req, res, next) => {
    const easyRegScores = await scoresModel.getScores(1);
    const medRegScores = await scoresModel.getScores(2);
    const hardRegScores = await scoresModel.getScores(3);

    const getAllKills = await Kills.getAllKills();
    let totalKills = 0;
    getAllKills.forEach(e => { totalKills += e.kill_count})

    // const easyFlickScores = await scoresModel.getScores(4);
    // const medFlickScores = await scoresModel.getScores(5);
    // const hardFlickScores = await scoresModel.getScores(6);
    // const apocRegScores = await scoresModel.getScores(7);
    
    res.render('template', { 
        locals: {
            title: 'Scores',
            isLoggedIn: req.session.loggedIn,
            easy: easyRegScores,
            med: medRegScores,
            hard: hardRegScores,
            allKills: totalKills
            // apoc: apocRegScores
        },
        partials: {
            partial:'partial-regular-scores'
        }
    });
});

module.exports = router;
