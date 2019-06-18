const scoresModel = require('../models/scores');

exports.get = async (req,res) => {
    const easyRegScores = await scoresModel.getScores(1);
    const medRegScores = await scoresModel.getScores(2);
    const hardRegScores = await scoresModel.getScores(3);
    res.render('template',
    {
        locals:{
            title: 'Scores',
            isLoggedIn: req.session.loggedIn,
            easy: easyRegScores,
            med: medRegScores,
            hard: hardRegScores
        },
        partials:{
            partial:'partial-regular-scores'
        }
    });
};