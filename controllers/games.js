const Games = require('../models/games'),
    Kills = require('../models/killCount');

// GETS
exports.games_get = (req,res) => {
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
}

exports.games_mode_get = (req,res) => {
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
}

exports.games_mode_difficulty_get = async (req,res) => {
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
                title: 'Choose a Proper Game Mode',
                isLoggedIn: req.session.loggedIn
            },
            partials: {
                partial:'partial-games'
            }
        });
    }
}

// POSTS
exports.games_post = (req,res) => {
    const { mode, difficulty } = req.body;
    res.redirect(`/games/${mode}/${difficulty}`);
}

exports.games_mode_difficulty_post = async (req,res) => {
    const { accuracy, points, userId, gameModeId, killCount } = req.body;
    const { gameMode, difficulty } = req.params;
    const gameInstance = new Games(gameMode,difficulty);
    const getGameMode = await gameInstance.isGameMode();

    const killInstance = new Kills(null, null, userId)
    const getKillCount = await killInstance.checkKillCount();

    await killInstance.addKills(parseInt(getKillCount.kill_count) + parseInt(killCount));
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
} 