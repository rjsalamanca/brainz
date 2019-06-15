const express = require('express'),
    router = express.Router(),
    Games = require('../models/games');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('template', 
    { 
        locals:{
            title: 'Games',
            isLoggedIn: req.session.loggedIn
        },
        partials: {
            partial:'partial-games'
        }
    });
});

router.get('/:mode', function(req, res, next) {    
    res.render('template', 
    { 
        locals:{
            title: 'Choose Game Mode First',
            isLoggedIn: req.session.loggedIn
        },
        partials: {
            partial:'partial-games'
        }
    });
});

router.get('/:mode/:difficulty', async (req, res) => {
    const { mode, difficulty} = req.params;
    const gameInstance = new Games(mode,difficulty);
    const getGameMode = await gameInstance.isGameMode();
    
    if(typeof getGameMode === 'object'){
        res.render('template', 
        { 
            locals:{
                title: 'Survive the Zombies!',
                gameMode: getGameMode,
                firstPlay: true,
                isLoggedIn: req.session.loggedIn,
                user: req.session.user
            },
            partials: {
                partial:'partial-games-play'
            }
        });
    } else {
        res.render('template', 
        { 
            locals:{
                title: 'Choose a Proper Game Mode'
            },
            partials: {
                partial:'partial-games'
            }
        });
    }
});

router.post('/', async (req, res, next) => {
    const { mode, difficulty } = req.body;
    
    res.redirect(`/games/${mode}/${difficulty}`);

    // res.render('template', { 
    //     locals: {
    //         title: 'Scores',
    //         scores: getScores,
    //         users: getUsers
    //     },
    //     partials: {
    //         partial:'partial-scores'
    //     }
    // });
});

router.post('/:gameMode/:difficulty', async (req, res, next) => {
    const { accuracy, points, userId, gameModeId } = req.body;
    const { gameMode, difficulty } = req.params;
    const gameInstance = new Games(gameMode,difficulty);
    const getGameMode = await gameInstance.isGameMode();

    await Games.addScore(accuracy, points, userId, gameModeId);
    res.render('template', 
    { 
        locals:{
            title: 'Survive the Zombies!',
            gameMode: getGameMode,
            firstPlay: false,
            previousScore: req.body,
            isLoggedIn: req.session.loggedIn,
            user: req.session.user
        },
        partials: {
            partial:'partial-games-play'
        }
    });
});

module.exports = router;