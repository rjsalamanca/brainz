const express = require('express'),
    router = express.Router(),
    Games = require('../models/games');

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

// router.get('/regular', function(req, res, next) {
//     res.render('template', 
//     { 
//         locals:{
//             title: 'Regular'
//         },
//         partials: {
//             partial:'partial-games-regular'
//         }
//     });
// });

router.get('/:mode', function(req, res, next) {    
    res.render('template', 
    { 
        locals:{
            title: 'Choose Game Mode First'
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
                title: 'LETS PLAY!',
                gameMode: getGameMode
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

module.exports = router;
